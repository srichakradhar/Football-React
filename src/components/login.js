import React, { Component } from 'react';
import axios from "axios";
import { NavLink } from "react-router-dom";
import '../css/login.css'
import Modal from "./pop"
import admin from "../images/admin.png"
import user from "../images/user.png"
import football from "../images/football.png"

class Login extends Component {

  state = {
    show: false,
    showUser: false,
    name: '',
    password: '',
  }

  adminForm = () => {
    this.setState({
      show:true
    })
  }

  userForm = () => {
    this.setState({
      showUser:true
    })
  }

  loginCall = async () => {
    let response;
    if(this.state.show === true){
      await axios
      .post("/api/login", {
        name: this.state.name,
        password: this.state.password,
      })
      .then((res) => {response = res.data})
      .catch((err) => alert(err.response.data.message));
      this.setState({
        name: "",
        password: "",
      })
      return response;
    }
    else if(this.state.showUser === true){
      await axios
      .post("/api/teams/login", {
        name: this.state.name,
        password: this.state.password,
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err.response.data.message));
      this.setState({
        name: "",
        password: "",
      })
    return response;
    }
  };

  Login = async (e) =>{
    e.preventDefault();
    let response = await this.loginCall();
    if(this.state.show === true){
      if (response) {
        localStorage.token = response.token;
        localStorage.isAdmin = true
        this.props.history.push("/teamDetails");
      }
    }
    else if(this.state.showUser === true){
      if (response) {
        localStorage.token = response.token;
        localStorage.UserName = response.team.name
        this.props.history.push("/teamDetails");
      }
      this.setState({
        name: "",
        password: "",
      })
    }
  }

  Clear = () => {
    this.setState({
      name: "",
      password: "",
    })
  }

  onClose = () => {
    this.setState({
      show: false,
      showUser: false
    })
    this.Clear()
  }

  render() { 
    return (
      <div>
        <h1 className="h1">Football Tournament<img src={football} alt="Avatar" style={{width:"80px" , height:"80px"}} /></h1>
        <div className="crd">
          <div className="card">
            <img src={admin} alt="Avatar" style={{width:"100%"}} />
            <div className="container">
              <button className="btn1" onClick={this.adminForm}>Admin Login</button> 
            </div>
          </div>
          <div className="card">
            <img src={user} alt="Avatar" style={{width:"100%"}} />
            <div className="container">
              <button className="btn2" onClick={this.userForm}>User Login</button> 
            </div>
          </div>
        </div>
        {this.state.show ? 
          <Modal>
            <div className='bg'></div> 
            <div className= 'pop'>
              <h2 className='rmh2'>Admin Login</h2> 
              <button className='close' onClick={this.onClose}>X</button>
              <div className='popmain'>
                <label>User Name</label>
                <br />
                <br />
                <input type='text' className='input' placeholder=' Enter Your Team Name' value={this.state.name || ''} onChange={(e) => {this.setState({ name: e.target.value })}} />
                <br />
                <br />
                <label>Password</label>
                <br />
                <br />
                <input type='password' className='input' placeholder=' Enter Your Password' value={this.state.password || ''} onChange={(e) => {this.setState({ password: e.target.value })}} />
                <br />
                <br />
                <button type="button" className="rsave"  onClick={this.Login}>Login</button>
                <button type="button" className="rcancel" onClick={this.Clear}>Clear</button>
              </div>           
            </div>
          </Modal> : null
        }

        {this.state.showUser ? 
          <Modal>
            <div className='bg'></div> 
            <div className= 'pop'>
              <h2 className='rmh2'>User Login</h2> 
              <button className='close' onClick={this.onClose}>X</button>
              <div className='popmain'>
                <label>User Name</label>
                <br />
                <br />
                <input type='text' className='input' placeholder=' Enter Your Team Name' value={this.state.name || ''} onChange={(e) => {this.setState({ name: e.target.value })}} />
                <br />
                <br />
                <label>Password</label>
                <br />
                <br />
                <input type='password' className='input' placeholder=' Enter Your Password' value={this.state.password || ''} onChange={(e) => {this.setState({ password: e.target.value })}} />                
                <br />
                <br />
                <button type="button" className="rsave"  onClick={this.Login}>Login</button>
                <button type="button" className="rcancel" onClick={this.Clear}>Clear</button>
              </div>
              <p className="loginlink">New User ?<NavLink to={'/Register'} onClick={this.onClose}>Click here</NavLink></p>           
            </div>
          </Modal> : null
        }
      </div>
    );
  }
}
 
export default Login;