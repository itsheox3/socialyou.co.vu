var io = require('socket.io').listen(81)

var Rooms = [];

var Users = [];

var UCount = 0;

io.sockets.on('connection', function (sck) {

	sck.on('registerusertoroom',function (data) {
		try {
		if(Rooms[data.roomid] !== undefined) {
		io.sockets.emit('message', { userid: data.userid, roomid: data.roomid, message: '', action: ' has joined ' + data.roomid });
		sck.room = Rooms[data.roomid];
		sck.roomid = data.roomid;
		sck.usrobj = sck;
		sck.usrid = data.userid;
		//Users[UCount] = {
		//	userid: sck.usrid,
		//	inRoom: Rooms[sck.roomid],
		//	video: Rooms[sck.roomid].video
		//};
		//Users[UCount] = sck.usr.obj;
		//Rooms[sck.room.id].Users.push(Rooms[sck.roomid].UCount, sck.usrobj);
		//++Users[UCount];
		++Rooms[sck.roomid].UCount;
		io.sockets.emit('updateusercount', { roomid: sck.roomid, roomuserscount: Rooms[sck.roomid].UCount });
		} else {
		Rooms[data.roomid] = {

			//Users: [],

			UCount: 0,

			video: ''

		};
		//Users[UCount] = {
		//	userid: data.userid,
		///	inRoom: Rooms[data.roomid],
		//	video: ''
		//};
		sck.roomid = data.roomid;
		sck.usrobj = sck;
		sck.usrid = data.userid;
		//Users[UCount].userid = sck.usrid;
		//Rooms[sck.roomid].Users.push(Rooms[sck.roomid].UCount, sck.usrobj);
		//++Users[UCount];
		++Rooms[sck.roomid].UCount;
		io.sockets.emit('updateusercount', { roomid: sck.roomid, roomuserscount: Rooms[sck.roomid].UCount });

		}
		} catch (err) {
			console.log(err);
		}
	});
	sck.on('userplayinroom', function (data) {
		//console.log(data);
		try {
		Rooms[data.roomid].video = data.videourl;
		//sck.usr.obj.emit('djplay', { video: Rooms[data.roomid].video });
		//for(var i = 0; i > Rooms[data.roomid].Users.length; i++) {
		//	//Rooms[data.roomid].Users[i].video = Rooms[data.roomid].video;
			console.log('Users play ' + Rooms[data.roomid].video);
			io.sockets.emit('djplay', {roomid: data.roomid, video: Rooms[data.roomid].video });
		//}
		console.log(data);
		} catch (err) {
			console.log(err);
		}
	})
	sck.on('disconnect', function () {
		try {
			--Rooms[sck.roomid].UCount;
			io.sockets.emit('updateusercount', { roomid: sck.roomid, roomuserscount: Rooms[sck.roomid].UCount });
			io.sockets.emit('message', { userid: sck.usrid, roomid: sck.roomid, message: '', action: ' has left ' + sck.roomid });

		} catch (err) {
			console.log(err);
		}
	});

sck.on('getcurrentvid', function (data) {
		try {
			sck.emit('djplay', { roomid: data.roomid, video: Rooms[sck.roomid].video });
		} catch (err) {
			console.log(err);
		}
	});
	sck.on('messagetoroom', function (data) {
		if(data.action !== '') {
		io.sockets.emit('message', { userid: data.userid, roomid: data.roomid, message: '', action: data.roomid });
		} else {
		io.sockets.emit('message', { userid: data.userid, roomid: data.roomid, message: data.message, action: '' });
		}
	})
/*
	sck.on('getroomusers', function () {
		try {
			sck.user.obj.emit('');
		} catch (err) {

		}
	});
*/
});

