function initialize(io, globals){
	io.sockets.on('connection', function(socket){     

		console.log('-' + socket.id);
	
		/// Welcome to the new client
		socket.emit('Welcome', {Message: 'Welcome to Clapp.Kerberos', SocketId : socket.id});
        
        socket.emit('Clapp.Kerberos.Message', {Command : 'GiveYourHydraInformation'});
		
		/*
		================
		socket events
		*/
		socket.on('ImConnected', function(data){
			console.log('Raspberry Pi: ' + data.KerberosId);
		});
        
        socket.on('GetKerberosSettings', function(data){
            socket.emit('Clapp.Kerberos.Settings', {Hydras: globals.Hydras});
        });
        
        socket.on('GetHydraInformation', function(data){
            if (data!= undefined && data != null) {
                io.sockets.emit('Clapp.Kerberos.Message', {Command : 'GiveYourAllInformation', Values : { UUID : data.UUID}});
            }
        });
        
        socket.on('Clapp.Hydra.Information', function(data){
            console.log('Socket catched: Clapp.Hydra.Information');
            globals.Hydras.push(data.HydraSettings);
            io.sockets.emit('Clapp.Kerberos.Message', {Command : 'HydrasConnected', Values : {Hydras: globals.Hydras}});
        });
        
        socket.on('Clapp.Hydra.Message', function(data){
            if(data != undefined && data != null)
                hydraMessagesHub(data);
        })
				
		/* 
		================
		Local functions 
		*/
        
        function hydraMessagesHub(data){
            var command = data.Command;
            var values = data.Values;
            
            switch(command) {
                case "ThisIsMyOwnHydraInformation":
                    var information = {
                        HydraInformation : values.HydraInformation,
                        Beacons : values.Beacons
                    }
                    io.sockets.emit('Clapp.Kerberos.Message', {Command : 'HydraInformationByUUID', Values : information});
                    break;
            }
        }
		
		/// sendKerberosMessage
		function sendKerberosMessage(){			
			socket.emit('Clapp.Kerberos.Message', {Command : 'KerberosCommand', Values : 1});
		}
		
		/// Emit Heartbeat request
		function raspberryHeartbeat(){
			socket.emit('youRConnected?');
		}
		
		/* 
		================
		Socket Intervals
		*/
		/// Emit every 5 seconds cranes
		//setInterval(raspberryHeartbeat, 5000);
	
		/* 
		================
		Templates for Socket.io
		*/
		/// Template for socket event
		//socket.on('', function(data){
		//  io.sockets.emit('Name', data);
		// socket.emit('ID', {Command: 'CommandID', Values:[{ID: socket.id}]});
		//});
	
	});
		
	console.log('Socket.io initialized');
}

exports.initialize = initialize;