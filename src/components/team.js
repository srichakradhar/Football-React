import React, { Component } from 'react';
import axios from "axios";
import {NavLink} from 'react-router-dom'
import '../css/team.css'
import close from "../images/close.png"

class Team extends Component {

  state = {
    player: [],
    selectedplayers: [],
    admin: false,
  }

  async componentDidMount() {
    await this.getPlayer();
    await this.getPlayEleven();
  }


  getPlayer = async () => {
    let response
    if(localStorage.isAdmin){
      await axios.get(`/api/admin/players/view/${localStorage.adminTeamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err.response.data.errmsg))
      this.setState({
        player: response,
        admin: true
      })
      return response;
    }
    else{
      await axios.get(`/api/players/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err.response.data.errmsg))
      this.setState({
        player: response,
        admin: false
      })
      return response;
    }
  };

  getPlayEleven = async () => {
    let response
    if(this.state.admin){
      await axios.get(`/api/admin/teams/eleven/${localStorage.adminTeamId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err))
      this.setState({
        selectedplayers: response
      })
      return response;
    }
    else{
      await axios.get(`/api/teams/eleven`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response = res.data))
      .catch(err => alert(err))
      this.setState({
        selectedplayers: response
      })
      return response;
    }
  };

  movePlayer = async (data) => {
    let response;
    if(this.state.admin){
      if(this.state.selectedplayers.team11s.length < 11){
        await axios
          .patch(`/api/admin/players/update/${data._id}`, 
            {
              age: data.age,
              belongsTo: data.belongsTo,
              goalsScored: data.goalsScored,
              inEleven: true,
              name: data.name,
              noOfMatches: data.noOfMatches,
              type: data.type,
              __v: data.__v,
              _id: data._id
            },
            {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          })
          .then((res) => (response = res.status))
          .catch(err => alert(err))
          await this.getPlayEleven()
        return response;
        }
        else{
          alert("Maximum Player Selected")
        }
    }
    else{
      if(this.state.selectedplayers.team11s.length < 11){
        await axios
          .patch(`/api/players/update/${data._id}`, 
            {
              age: data.age,
              belongsTo: data.belongsTo,
              goalsScored: data.goalsScored,
              inEleven: true,
              name: data.name,
              noOfMatches: data.noOfMatches,
              type: data.type,
              __v: data.__v,
              _id: data._id
            },
            {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          })
          .then((res) => (response = res.status))
          .catch(err => alert(err))
          await this.getPlayEleven()
        return response;
        }
        else{
          alert("Maximum Player Selected")
        }
    }
  };

  removePlayer = async (data) => {
    let response;
    if(this.state.admin){
      await axios
      .patch(`/api/admin/players/update/${data._id}`, 
        {
          age: data.age,
          belongsTo: data.belongsTo,
          goalsScored: data.goalsScored,
          inEleven: false,
          name: data.name,
          noOfMatches: data.noOfMatches,
          type: data.type,
          __v: data.__v,
          _id: data._id
        },
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .catch(err => alert(err))
      await this.getPlayEleven();
    return response;
    }
    else{
      await axios
      .patch(`/api/players/update/${data._id}`, 
        {
          age: data.age,
          belongsTo: data.belongsTo,
          goalsScored: data.goalsScored,
          inEleven: false,
          name: data.name,
          noOfMatches: data.noOfMatches,
          type: data.type,
          __v: data.__v,
          _id: data._id
        },
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .catch(err => alert(err))
      await this.getPlayEleven();
    return response;
    }

  };
  
  handleLogout = async () => {
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
          <NavLink className="lblink" to={'/teamDetails'}>Team Details</NavLink>
          Team 11
          <NavLink className="tlink" to={'/'} onClick={this.handleLogout}>LogOut</NavLink>
        </h3>
          <div className="maindiv">
            <h2 className="title">List Of Players</h2>
            {this.state.player.map((data , id) => (
              <ul className="list" key={id}>
                <li className="listItem" onClick={() => this.movePlayer(data)}>{data.name} -- {data.type}</li>
              </ul>
            ))}
          </div>
          <h2 className="thead">Team 11 Players</h2>
          <div className='tabledata'>
          {this.state.selectedplayers.team11s === undefined ? <h2>Select Players to Display</h2> : 
          <table className= 'mtable'>
            <tbody className="tbody">
              {this.state.selectedplayers.team11s.map((details, index) =>(
                <tr className="tr" key={index}> 
                  <td className="td">{details.name}</td>
                  <td className="td">{details.type}</td>
                  <td className="td"><img src={close} alt="close" style={{width:"30px" , height:"30px"}} onClick={() => this.removePlayer(details)} /></td>
              </tr> 
            ))} 
          </tbody>
          </table>}
          </div> 
          <h2 className="thead2">{this.state.selectedplayers.message}</h2>
      </div>
    );
  }
}
 
export default Team;