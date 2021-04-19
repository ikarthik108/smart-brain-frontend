import React from 'react';
import Tilt from 'react-tilt';
import './Logo.css'
import brain from './ezgif.com-gif-maker.gif';

const Logo = () => {

	return (
		<div className='ma4 mt0'>
			<Tilt className="Tilt br2 shadow-3" options={{ max : 55 }} style={{ height: 120, width: 120 }} >
	 		<div className="Tilt-inner pa1">
	 			<img style={{paddingTop:'1px',height: 110, width: 110}} src ={brain} alt='logo'/>
	 		</div>
			</Tilt>
		</div>
		);
}

export default Logo;