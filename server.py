from flask import Flask, session, redirect, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import secrets

ROOMS = {}

socketio = SocketIO()

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = str(secrets.token_hex(32))

socketio.init_app(app)

@socketio.on('joined', namespace='/game')
def joined(message):
    room = session.get('room')
    join_room(room)
    emit('info', {'message': "Attente des autres joueurs ({}/{})".format(ROOMS[room]['players'],ROOMS[room]['places'])}, room=room)
    if ROOMS[room]['players'] == ROOMS[room]['places']:
        for i in reversed(range(1,6)):
            print(i)
            emit('info', {'message': str(i)}, room=room)
            socketio.sleep(1)
        emit('start', {}, room=room)


@socketio.on('j', namespace='/game')
def move(message):
    emit('j', message, room=session.get('room'))

@socketio.on('tir', namespace='/game')
def tir(message):
    emit('tir', message, room=session.get('room'))


#@socketio.on('left', namespace='/game')
#def left(message):
#    game = session.get('room')
#    leave_room(game)
#    emit('status', {'msg': session.get('name') + ' has left the room.'}, room=game)

@app.route('/', methods=['GET'])
def index():
    response = ""
    for i in range(2,5):
        response += "<a href='/new/{}'>{} joueurs</a><br/>".format(i,i)
    return response

@app.route('/new/<int:places>', methods=['GET'])
def new(places):
    room_id = str(secrets.token_hex(2))
    ROOMS[room_id] = {}
    ROOMS[room_id]['places'] = places
    ROOMS[room_id]['players'] = 0
    ROOMS[room_id]['status'] = 'waiting'
    return redirect("/game/"+room_id, code=302)

@app.route('/game/<string:room>', methods=['GET'])
def game(room):
    session['room'] = room
    print(session)
    if room not in ROOMS:
        return 'Game not found', 404
    if ROOMS[room]['players'] >= ROOMS[room]['places']:
        return 'Game full', 401
    if 'player_id' not in session:
        session['player_id'] = ROOMS[room]['players']
        ROOMS[room]['players'] += 1
    return render_template('game.html', player_id=session.get('player_id'), places=ROOMS[room]['places'])

socketio.run(app=app, debug=True, host='0.0.0.0', port=80)