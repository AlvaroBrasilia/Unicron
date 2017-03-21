export class Unicron{
	constructor( c ){
		const config = c || {},
			app = config.app, 
			root = config.root,
			uid = this.guid();

		this.uid = uid;

		if(typeof window.___temp_Unicron === 'undefined')   window.___temp_Unicron = {};

		window.___temp_Unicron[ uid ] = {
			es5modules: {}
		};

		this.app = app || this;
		
		this.root = root || document.body;

		this.environment = 'development';

		this.onDemand = {
        	queue: []
        };

        this._queue_active = false;

        this._es5modules = {

        };
	}
	load(url, callback, update) {
	    const self = this;

	    update = update || false;

	    if (Array.isArray(url)) {
	        self._enqueue( url.map(function( path ) {
	             return { url: path, callback: callback, update: update };
	        }) );
	    } else {
	         self._enqueue( { url: url, callback: callback, update: update } );
	    }
	    
	    self.process_queue( );
	}
	_load(url, callback, update) {
	    let self = this,
	        arrType, type, s, nodeType, node, tag_id = url.split("?")[0], request = new XMLHttpRequest();

	    arrType = url.split(".");
		type = arrType[arrType.length - 1];

	    if( ! update  )
	    {
	    	if(  document.getElementById(url) != null  )
	    	{
	    		callback();
	    		return;
	    	}
	    }

		if (url.indexOf(".css") != -1) {
		    nodeType = "link";
		    node = document.createElement(nodeType);
		    node.setAttribute("rel", "stylesheet");
		    node.setAttribute("type", "text/css");
		} else {
		    nodeType = "script";
		    node = document.createElement(nodeType);
		    node.setAttribute("type", "text/javascript");
		}

		node.setAttribute("id", url);

		request.open("GET", url, true);
		request.send();
		request.onreadystatechange = function() {
			let responseTex = request.responseText,
				uid = self.uid;
		    if (request.readyState == 4 && request.status == 200) {
		        
		        node.textContent = `window.___temp_Unicron["${uid}"].es5modules["${url}"] = (function(_root) {  ${responseTex} })(window);`;
		        
		        document.getElementsByTagName('head')[0].appendChild(node);
		        self._es5modules[ url ] = window.___temp_Unicron[ uid ].es5modules[ url ];

		        callback();
		    }
		}
	}
	_enqueue( c ){
		this.onDemand.queue.push( c );
	}
	process_queue( ) {
	    let self = this,
	    	first_on_queue = '';

	    if( self._queue_active )
	    	return;

	    if (self.onDemand.queue.length > 0) {
	    	self._queue_active = true;
	        
	        first_on_queue = self.onDemand.queue.shift();
	        
	        self._load(first_on_queue.url, function() {
	        	
	        	first_on_queue.callback(  self._es5modules[ first_on_queue.url ] );
	            self.process_queue();
	        }, first_on_queue.update);
	    } else {
	        self._queue_active = false;
	    }
	}
	uid() {
        return ((Date.now() & 0x7fff).toString(32) + (0x100000000 * Math.random()).toString(32));
    }
    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    // Generate a pseudo-GUID by concatenating random hexadecimal.
    guid(){
        var self = this;
        return (self.S4() + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + "-" + self.S4() + self.S4() + self.S4());
    }
}