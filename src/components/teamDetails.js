import React, { Component } from 'react';
import axios from "axios";
import { NavLink } from "react-router-dom";
import "../css/teamDetails.css"
import edit from "../images/edit.png";
import trash from "../images/trash.png";
import Modal from "./pop"
import {validateCoachName , validateCountryName  , validateTeamName} from "./validation"

class TeamDetails extends Component {
   
  state = {
    team: [],
    _id: undefined,
    team_name:'',
    coach_name:'',
    country_name:'',
    show: false,
    admin: false,
    edit: false,
    user: "",
    tname_error: "",
    cname_error: "",
    country_error: "",
  }

  async componentDidMount() {
    await this.getDetails();
  }

  getDetails  = async () => {
    let response
    if(localStorage.isAdmin){
      await axios.get(`/api/admin/teams/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err))
      this.setState({
        team: response,
        admin: true
      })
      return response;
    }
    else{
      await axios.get(`/api/teams/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err))
      this.setState({
        team: response,
        admin: false,
        user: localStorage.UserName
      })
      return response;
    }
  };

  handleChange = (e) => {
    let target = e.target.name
    let param = e.target.value
    this.setState({
      [e.target.name]: e.target.value,
    })
    if (target === "team_name") {
      this.setState(validateTeamName(param))
    }
    else if (target === "coach_name") {
      this.setState(validateCoachName(param))
    }
    else if (target === "country_name") {
      this.setState(validateCountryName(param))
    }
  }

  deleteTeam = async (data) => {
    let response;
    if(this.state.admin){
      await axios
      .delete(`/api/admin/teams/delete/${data._id}`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("Team Deleted Successfully"))
      .catch(err => alert(err))
      await this.getDetails();
    return (response);
    }
    else{
      await axios
      .delete(`/api/teams/delete`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("Team Deleted Successfully") , this.props.history.push("/"),
      alert("You are No More a Valid user "))
      .catch(err => alert(err))
    return (response);
    }
  };

  editTeam = async (data) => {
    if(this.state.admin){
      this.setState({
        _id: data._id,
        team_name: data.name,
        coach_name: data.coach,
        country_name: data.country,
        show: true,
      })
    }
    else{
      this.setState({
        _id: data._id,
        coach_name: data.coach,
        edit: true,
      })
    }
  };

  editSaveteam = async () => {
    let response;
    if(this.state.admin){
      await axios
      .patch(`/api/admin/teams/update/${this.state._id}`, {
        name: this.state.team_name,
        coach: this.state.coach_name,
        country: this.state.country_name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
      )
      .then((res) => (response = res.status))
      .catch(err => alert(err))
    return response;
    }
    else{
      await axios
      .patch(`/api/teams/update`, {
        coach: this.state.coach_name,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
      )
      .then((res) => (response = res.status))
      .catch(err => alert(err))
    return response;
    }
  };

  onSubmit = async (e) => {
    e.preventDefault()
    let update_status = await this.editSaveteam();
    if(this.state.admin){
      if (update_status === 200) {
        alert("Team details Updated succesfully");
        this.setState({
          team_name:'',
          coach_name:'',
          country_name:'',
          show: false,
        })
      }
      await this.getDetails();
    }
    else{
      if (update_status === 200) {
        alert("Coach Name Updated succesfully");
        this.setState({
          coach_name:'',
          edit: false,
        })
      }
      await this.getDetails();
    }
  }

  leaderBoard = () => {
    this.props.history.push('/leaderboard')
  }

  teamNav = (data) => {
    if(this.state.admin){
      localStorage.adminTeamId = data
      this.props.history.push('/team')
    }
    else{
      this.props.history.push('/team')
    }
  }

  addPlayers = (data) => {
    if(this.state.admin){
      localStorage.adminTeamId = data
      this.props.history.push('/editor')
    }
    else{
      this.props.history.push('/editor')
    }
  }

  onClose = () => {
    this.setState({
      _id: undefined,
      team_name:'',
      coach_name:'',
      country_name:'',
      show: false,
      edit:false,
    })
  }

  ResetForm = (e) => {
    e.preventDefault()
    this.setState({
      team_name:'',
      coach_name:'',
      country_name:'',
    })
  }

  handleLogout =  async () => {
    localStorage.clear();
    alert("LogOut Sucessfull");
  };

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
      <div>
        <h2 style={mystyle}>
          FootBall Tournament Management
        </h2>
        <h3 style={h2}>
          Team Details
          <NavLink className="tdlink" to={'/'} onClick={this.handleLogout}>LogOut</NavLink>
        </h3>
        <div className="header">
          {this.state.admin ? null : <p>Hi! {this.state.user}</p>}
          {this.state.admin ? null :
          <>
            <button className="tm"  onClick={this.teamNav}>Team 11</button>
            <button className="play" onClick={this.addPlayers}>Add/View Players</button>
          </>
          }
        </div>
        <br />
        {this.state.team.length === 0 ? <h2>No Teams To Display</h2> : 
        <>
        {this.state.admin ? 
        <div className="table">
        <table>
          <tbody>
            <tr>
              <th>Team Name</th>
              <th>Country</th>
              <th>Coach Name</th>
              <th>Edit</th>
              <th>Delete</th>
              <th>Team 11</th>
              <th>Player Details</th>
            </tr>
            {this.state.team.map((data , index) => (
              <tr key={index}>
               <td>{data.name}</td>
               <td>{data.country}</td>
               <td>{data.coach}</td>
               <td><img src={edit} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.editTeam(data)} /></td>
               <td><img src={trash} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.deleteTeam(data)} /></td>
               <td><button className=""  onClick={() => this.teamNav(data._id)}>Team 11</button></td>
               <td><button className="" onClick={() => this.addPlayers(data._id)}>Add/View Players</button></td>
             </tr>
            ))}
          </tbody>
        </table>
        </div> : 
        <div className="table">
        <table>
          <tbody>
            <tr>
              <th>Team Name</th>
              <th>Country</th>
              <th>Coach Name</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
            {this.state.team.map((data , index) => (
              <tr key={index}>
               <td>{data.name}</td>
               <td>{data.country}</td>
               <td>{data.coach}</td>
               {this.state.user === data.name ? 
               <>
               <td><img src={edit} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.editTeam(data)} /></td>
               <td><img src={trash} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.deleteTeam(data)} /></td>
               </>
              : null }
             </tr>
            ))}
          </tbody>
        </table>
        </div>}
        </>}
        {this.state.show ? 
          <Modal>
            <div className='bg'></div> 
            <div className="pop1">
              <h2>Edit Team Details</h2>
              <button className='close' onClick={this.onClose}>X</button>
              <form className="">
                <label>Team Name</label>
                <br />
                <input type='text' className="tinput" name='team_name' value={this.state.team_name || ""} onChange={this.handleChange} />
                <br />
                <span id="error_msg" style={{ color: "Red" }}>{this.state.tname_error}</span>
                <br />
                <label>Coach Name</label>
                <br />
                <input type='text' className="tinput"  name='coach_name' value={this.state.coach_name || ""} onChange={this.handleChange} />
                <br />
                <span id="error_msg" style={{ color: "Red" }}>{this.state.cname_error}</span>
                <br />
                <label>country Name</label>
                <br />
                <input type='text' className="tinput" name='country_name' value={this.state.country_name || ""} onChange={this.handleChange} />
                <br />
                <span id="error_msg" style={{ color: "Red" }}>{this.state.country_error}</span>
                <br />
                <div className="veiwbtn">
                  <button className='savebtn'  onClick={this.onSubmit}>Save</button>
                  <button className="clearbtn" onClick={this.ResetForm}>Clear</button>
                </div>
              </form>
            </div>
          </Modal> : null}
          {this.state.edit ? <Modal>
            <div className='bg'></div> 
            <div className="pop2">
              <h2>Edit Coach Name</h2>
              <button className='close' onClick={this.onClose}>X</button>
              <form className="">
                <label>Coach Name</label>
                <br />
                <br />
                <input type='text' className="tinput" name='coach_name' value={this.state.coach_name || ""} onChange={this.handleChange} />
                <br />
                <span id="error_msg" style={{ color: "Red" }}>{this.state.cname_error}</span>
                <br />
                <div className="veiwbtn">
                  <button className='savebtn'  onClick={this.onSubmit}>Save</button>
                  <button className="clearbtn" onClick={this.ResetForm}>Clear</button>
                </div>
              </form>
            </div>
          </Modal> : null}
          <footer>
            <button onClick={this.leaderBoard}>Tournament Leader Board</button>
          </footer>
      </div>
    );
  }
}
 
export default TeamDetails;