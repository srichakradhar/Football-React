import React, { Component } from 'react';
import axios from "axios";
import { NavLink } from "react-router-dom";
import {Row , Col} from "react-bootstrap";
import '../css/Register.css'
import {validateConfirmPswd , validateCoachName , validateCountryName , validatePassword , validateTeamName} from "./validation"

class Register extends Component {
  state = {
    team_name:'',
    coach_name:'',
    country_name:'',
    password:'',
    confirm_password:'',
    confirm_password_error:'',
    pass_error: "",
    tname_error: "",
    cname_error: "",
    country_error: "",
  }

  axiosCall = async () => {
    let response;
    await axios
      .post("/api/teams/registration", {
        name: this.state.team_name,
        coach: this.state.coach_name,
        password: this.state.password,
        country: this.state.country_name,
      })
      .then((res) => (response = res.status))
      .catch(err => alert(err.response.data.errmsg))
    return response;
  };

  handleChange = (e) => {
    let { password } = this.state
    let target = e.target.name
    let param = e.target.value
    this.setState({
      [e.target.name]: e.target.value,
    })
    if (target === "password") {
      this.setState(validatePassword(param))
    }
    else if (target === "confirm_password") {
      this.setState(validateConfirmPswd(param, password))
    }
    else if (target === "team_name") {
      this.setState(validateTeamName(param))
    }
    else if (target === "coach_name") {
      this.setState(validateCoachName(param))
    }
    else if (target === "country_name") {
      this.setState(validateCountryName(param))
    }
  }

  onSubmit = async (e) => {
    e.preventDefault()
    let status = await this.axiosCall();
    if (status === 201) {
      alert("Registration successfull.SignIn with registered details");
      this.props.history.push("/");
    }
  }

  ResetForm = () => {
    this.setState({
      team_name:'',
      coach_name:'',
      country_name:'',
      password:'',
      confirm_password:'',
      confirm_password_error:'',
      pass_error: "",
      tname_error: "",
      cname_error: "",
      country_error: "",
    })
  }

  render() {
    const mystyle = {
      margin: "2px",
      color: "white",
      backgroundColor: "#222831",
      padding: "10px",
    };
    const h2 ={
      marginTop: "-3px",
      color: "#30475e",
      backgroundColor: "#f0f0f0",
      padding: "10px",
    }  
    return (
      <div className='main'>
        <h2 style={mystyle}>
          FootBall Tournament Management
        </h2>
        <h3 style={h2}>
          Tournament Registration
        </h3>
        <form className='form'>
          <Row>
            <Col>
              <label className="lb">Team Name</label>
              <label>Coach Name</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <input type='text' id="input1" placeholder='Enter Your Team Name' name='team_name' value={this.state.team_name || ""} onChange={this.handleChange} />
              <input type='text' id="input2" placeholder='Enter Your Coach Name' name='coach_name' value={this.state.coach_name || ""} onChange={this.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col className="span">
            <span id="error_msg" style={{ color: "Red" }}>{this.state.tname_error}</span>
            <span id="error_msg" style={{ color: "Red" }}>{this.state.cname_error}</span>
            </Col>
          </Row>
          <label>Country Name</label>
          <input type='text' id="input3" placeholder='Enter Your Country Name' name='country_name' value={this.state.country_name || ""} onChange={this.handleChange} />
          <span id="error_msg" style={{ color: "Red" }}>{this.state.country_error}</span>
          <br />
          <br />
          <br />
          <Row>
            <Col>
              <label className="lb1">Password</label>
              <label>Confirm Password</label>
            </Col>
          </Row>
          <Row>
            <Col>
              <input type='password' id="input4" placeholder='Enter Your Password' name='password' value={this.state.password || ""} onChange={this.handleChange} />
              <input type='password' id="input5" placeholder='Confirm Password' name='confirm_password' value={this.state.confirm_password || ""} onChange={this.handleChange} />
            </Col>
          </Row>
          <Row>
            <Col>
              <span id="error_msg" style={{ color: "Red" }}>{this.state.pass_error}</span>
              <span id="error_msg" style={{ color: "Red" }}>{this.state.confirm_password_error}</span>
            </Col>
          </Row>
          <br />
          <div className="btn">
            <button className='submit' onClick={this.onSubmit}>Register</button>
            <button className="clear" onClick={this.ResetForm}>Clear</button>
          </div>
          <p className="link">Already Registered <NavLink to={'/'}>Click here</NavLink></p>
        </form>
      </div>
    );
  }
}
  
export default Register;