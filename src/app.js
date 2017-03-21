'use strict';

import { Unicron } from './src/Unicron.js'

var warrior = new Unicron();

console.log( warrior.guid() );

warrior.load( 'src/alert.js', (  x  ) => {
	
	console.log( x );
}, false );