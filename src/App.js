import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';





const particleOptions= {
    particles: {
      number: {
        value: 80,
        density: {
          enable:true,
          value_area: 800
        }
      }
    }
  }
  
class App extends React.Component {
  constructor() {
    super();
    this.state= {
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn:false,
      user: {
        id:'',
        name: '',
        email:'',
        password:'',
        entries:0,
        joining_date:''
      }
    }
  }

  


  // calculateFaceLocation = (data) => {
  //   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  //   const image = document.getElementById('inputimage');
  //   const width = Number(image.width);
  //   const height = Number(image.height);
  //   return {
  //     leftCol:clarifaiFace.left_col * width,
  //     topRow: clarifaiFace.top_row * height,
  //     rightCol: width - (clarifaiFace.right_col * width),
  //     bottomRow: height - (clarifaiFace.bottom_row * height)
  //   }
  // }

  loadUser=(data) => {
    this.setState({user: {
        id:data.id,
        name: data.name,
        email:data.email,
        password:data.password,
        entries:data.entries,
        joining_date:data.joining_date
    }
  })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange=(event) => {
    this.setState({input:event.target.value})
    
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://polar-tundra-76246.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
        .then(response=>response.json())
      .then(response => {
        if (response) {
          fetch('https://polar-tundra-76246.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }
  onRouteChange =(route) => {
    if (route==='signout') {
      this.setState(
        {
          input:'',
          imageUrl:'',
          box:{},
          route:'signin',
          isSignedIn:false,
          user: {
            id:'',
            name: '',
            email:'',
            password:'',
            entries:0,
            joining_date:''
          }
        }
      )
    } else if (route==='home') {
        this.setState({isSignedIn:true})
    }
    this.setState({route : route});
  }


  

  
  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}               
        />
        <Navigation isSignedIn={isSignedIn}  onRouteChange={this.onRouteChange}/>
        
        {
          this.state.route==='home' 
                ?
              <div>
                <Logo/>
                <Rank  name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm 
                onInputChange={this.onInputChange} 
                onButtonSubmit={this.onButtonSubmit}
                />
                <FaceRecognition box={box} imageUrl={this.state.imageUrl}/>
              </div>
                : (
                    this.state.route==='signin' 
                        ? 
                    <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
                        : 
                    <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
                    )
            
                      
      }
      </div>
    );
  } 
}
export default App;
