from flask import Flask, session, redirect, render_template, request
from flask_socketio import SocketIO, emit, join_room, leave_room
import secrets
import eventlet
eventlet.monkey_patch()

ROOMS = {}
PUBLIC_ROOMS = []

app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = str(secrets.token_hex(32))

socketio = SocketIO(app, async_mode='eventlet')

@socketio.on('connect')
def joined():
    room = session.get('room')
    if room not in ROOMS:
        session['room'] = None
        emit('info', {'message': 'Game not found'}, room=request.sid)
        return
    if ROOMS[room]['players'] >= ROOMS[room]['places']:
        session['room'] = None
        emit('info', {'message': 'Game full'}, room=request.sid)
        return
    session['player_id'] = ROOMS[room]['players']
    ROOMS[room]['players'] += 1
    emit('game_info', {'player_id': session.get('player_id'), 'players_count':ROOMS[room]['places']}, room=request.sid)
    join_room(room)
    emit('info', {'message': "Attente des autres joueurs ({}/{})".format(ROOMS[room]['players'],ROOMS[room]['places'])}, room=room)
    if ROOMS[room]['players'] == ROOMS[room]['places']:
        emit('confirm', {'message': "Pret ? (pressez une touche)"}, room=room)

@socketio.on('ready')
def ready(message):
    room = session.get('room')
    if room in ROOMS:
        ROOMS[room]['players_ready'] += 1
        emit('info', {'message': "Joueurs prets : ({}/{})".format(ROOMS[room]['players_ready'],ROOMS[room]['places'])}, room=room)
        if ROOMS[room]['players_ready'] == ROOMS[room]['places']:
            emit('map', {'map': ROOMS[room]['map']}, room=room)
            for i in reversed(range(1,6)):
                emit('info', {'message': str(i)}, room=room)
                socketio.sleep(1)
            ROOMS[room]['status'] = 'playing'
            emit('start', {}, room=room)

@socketio.on('end')
def end(message):
    room = session.get('room')
    if room in ROOMS:
        if ROOMS[room]['status'] == 'playing':
            ROOMS[room]['status'] = 'wainting'
            ROOMS[room]['map'] = {'width':9,'height':9,'seed':int(secrets.token_hex(32),16)}
            ROOMS[room]['players_ready'] = 0
            emit('confirm', {'message': "Recommencer ? (pressez une touche)"}, room=room)

@socketio.on('j')
def move(message):
    emit('j', message, room=session.get('room'))

@socketio.on('tir')
def tir(message):
    emit('tir', message, room=session.get('room'))

@socketio.on('disconnect')
def disconnect():
    room = session.get('room')
    if room in ROOMS:
        del ROOMS[room]
        if room in PUBLIC_ROOMS:
            PUBLIC_ROOMS.remove(room)
        emit('disconnect', {}, room=room)

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/new/<int:places>', methods=['GET'])
def new(places):
    room_id = str(secrets.token_hex(2))
    ROOMS[room_id] = {}
    ROOMS[room_id]['places'] = places
    ROOMS[room_id]['players'] = 0
    ROOMS[room_id]['status'] = 'waiting'
    ROOMS[room_id]['players_ready'] = 0
    ROOMS[room_id]['map'] = {'width':9,'height':9,'seed':int(secrets.token_hex(32),16)}
    return redirect("/game/"+room_id, code=302)

@app.route('/new/random', methods=['GET'])
def random():
    if len(PUBLIC_ROOMS) > 0:
        return redirect("/game/"+PUBLIC_ROOMS.pop(), code=302)
    else:
        room_id = str(secrets.token_hex(2))
        ROOMS[room_id] = {}
        ROOMS[room_id]['places'] = 2
        ROOMS[room_id]['players'] = 0
        ROOMS[room_id]['status'] = 'waiting'
        ROOMS[room_id]['players_ready'] = 0
        ROOMS[room_id]['map'] = {'width':9,'height':9,'seed':int(secrets.token_hex(32),16)}
        PUBLIC_ROOMS.append(room_id)
        return redirect("/game/"+room_id, code=302)

@app.route('/game/<string:room>', methods=['GET'])
def game(room):
    session['room'] = room
    return render_template('game.html')

socketio.run(app=app, debug=True, host='0.0.0.0', port=80)