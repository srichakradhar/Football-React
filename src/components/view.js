import React, { Component } from 'react';
import axios from "axios";
import {NavLink} from 'react-router-dom'
import {Row , Col} from "react-bootstrap";
import '../css/view.css'
import Modal from "./pop"
import edit from "../images/edit.png";
import trash from "../images/trash.png";
import {validatePlayerName , validatePlayerType , validateGame , validateAge , validateScore} from "./validation"

class Editor extends Component {

  state = {
    player : [],
    admin: false,
    id: undefined,
    _id: undefined,
    name: "",
    age: undefined,
    noOfMatches: undefined,
    goalsScored: undefined,
    type: "",
    belongsTo: undefined,
    playertypeError: "",
    playerNameError: "",
    ageError: "",
    gameError: "",
    scoreError: "",
    show: false,
    edit: false,
    validname: false,
    validtype: false,
    validnumber: false,
    validage: false,
    validgame: false
  }

  async componentDidMount() {
    await this.getPlayerDetails();
  }

  getPlayerDetails = async () => {
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
      return response.data;
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
      return response.data;
    }
  };

addNewPlayer = async () => {
    let response;
    if(this.state.admin){
      await axios
      .post(`/api/admin/players/register/${localStorage.adminTeamId}`, {
        name: this.state.name,
        age: this.state.age,
        noOfMatches: this.state.noOfMatches,
        goalsScored: this.state.goalsScored,
        type: this.state.type,
        belongsTo: this.state.id,
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
      .post(`/api/players/register`, {
        name: this.state.name,
        age: this.state.age,
        noOfMatches: this.state.noOfMatches,
        goalsScored: this.state.goalsScored,
        type: this.state.type,
        belongsTo: this.state.id,
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

  editPlayer = async (data) => {
    this.setState({
      _id: data._id,
      name: data.name,
      age: data.age,
      noOfMatches: data.noOfMatches,
      goalsScored: data.goalsScored,
      belongsTo: data.belongsTo,
      type: data.type,
      show: true,
      edit: true,
      validname: true,
      validtype: true,
      validnumber: true,
      validage: true,
      validgame: true
    })
  };

  editSavePlayer = async () => {
    let response;
    if(this.state.admin){
      await axios
      .patch(`/api/admin/players/update/${this.state._id}`, {
        name: this.state.name,
        age: this.state.age,
        noOfMatches: this.state.noOfMatches,
        goalsScored: this.state.goalsScored,
        type: this.state.type,
        belongsTo: this.state.id,
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
      .patch(`/api/players/update/${this.state._id}`, {
        name: this.state.name,
        age: this.state.age,
        noOfMatches: this.state.noOfMatches,
        goalsScored: this.state.goalsScored,
        type: this.state.type,
        belongsTo: this.state.id,
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

  deletePlayer = async (data) => {
    let response;
    if(this.state.admin){
      await axios
      .delete(`/api/admin/players/delete/${data._id}`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("Player Deleted Successfully"))
      .catch(err => alert(err))
      await this.getPlayerDetails();
    return (response);
    }
    else{
      await axios
      .delete(`/api/players/delete/${data._id}`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("Player Deleted Successfully"))
      .catch(err => alert(err))
      await this.getPlayerDetails();
    return (response);
    }
  };

  deleteAllPlayer = async () => {
    let response;
    if(this.state.admin){
      await axios
      .delete(`/api/admin/players/deleteAll/${localStorage.adminTeamId}`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("All Player Deleted Successfully"))
      .catch(err => alert(err))
      await this.getPlayerDetails();
    return (response);
    }
    else{
      await axios
      .delete(`/api/players/deleteAll`, 
        {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })
      .then((res) => (response = res.status))
      .then((res) => alert("All Player Deleted Successfully"))
      .catch(err => alert(err))
      await this.getPlayerDetails();
    return (response);
    }
  };

handleChange = (e) => {
    let target = e.target.name
    let param = e.target.value
    this.setState({
      [e.target.name]: e.target.value,
    })
    if (target === "name") {
      this.setState(validatePlayerName(param))
    }
    else if (target === "type") {
      this.setState(validatePlayerType(param))
    }
    else if (target === "age") {
      this.setState(validateAge(param))
    }
    else if (target === "noOfMatches") {
      this.setState(validateGame(param))
    }
    else if (target === "goalsScored") {
      this.setState(validateScore(param))
    }
  }

  onSubmit = async (e) => {
    e.preventDefault();
    if(this.state.edit === false){
      let status = await this.addNewPlayer();
      if (status === 201) {
        alert("Player details succesfully Added")
      }
      await this.getPlayerDetails();
    }
    else if(this.state.edit){
      let update_status = await this.editSavePlayer();
      if (update_status === 200) {
        alert("Player details Updated succesfully");
      }
      await this.getPlayerDetails();
    }
    this.onClose()
  }

  addPlayer = () => {
      if(this.state.player.length < 16){
        this.setState({
            show: true
        })
      }
      else{
          alert("Maximum Player Added")
      }
  }

  onClose = () => {
    this.setState({
      name:"",
      age: undefined,
      noOfMatches: undefined,
      goalsScored: undefined,
      type: "",
      show: false,
      edit: false,
      validname: false,
      validtype: false,
      validnumber: false,
      validage: false,
      validgame: false
    })
  }

  ResetForm = (e) => {
    e.preventDefault()
    this.setState({
      name:"",
      age: undefined,
      noOfMatches: undefined,
      goalsScored: undefined,
      type: "",
    })
  }

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
    const disable = this.state.validname && this.state.validtype && this.state.validnumber && this.state.validage && this.state.validgame? false : true;
    return (
      <div>
        <h2 style={mystyle}>
          FootBall Tournament Management
        </h2>
        <h3 style={h2}>
          <NavLink className="lblink" to={'/teamDetails'}>Team Details</NavLink>
          Player Deatils
          <NavLink className="tlink" to={'/'} onClick={this.handleLogout}>LogOut</NavLink>
        </h3>
        <button className="addbtn" onClick={this.addPlayer}>Add Player</button>
        <h2 className="h2">Player Details</h2>
        <div className='data'>
          <table className= 'tableView'>
            <tbody className="">
              <tr>
                <th>Player Name</th>
                <th>Player Type</th>
                <th>Player Age</th>
                <th>No Of Matches Played</th>
                <th>No Of Goals Scored</th>
                <th>Edit</th>
                <th>Delete 11</th>
              </tr>
              {this.state.player.map((details, index) =>(
                <tr key={index}> 
                  <td>{details.name}</td>
                  <td>{details.type}</td>
                  <td>{details.age}</td>
                  <td>{details.noOfMatches}</td>
                  <td>{details.goalsScored}</td>
                  <td><img src={edit} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.editPlayer(details)} /></td>
                  <td><img src={trash} alt="Avatar" style={{width:"20px" , height:"20px"}} onClick={() => this.deletePlayer(details)} /></td>
              </tr> 
            ))} 
          </tbody>
          </table>
          <br />
          {this.state.player.length === 0 ? null :
            <button className="deletebtn" onClick={this.deleteAllPlayer}>Delete All Players</button>
          }
          </div>
          {this.state.show ? 
          <Modal>
            <div className='bg'></div> 
            <div className="pop">
              {this.state.edit ? <h2>Edit Player Details</h2> : <h2>Add Player Details</h2>}
              <button className='close' onClick={this.onClose}>X</button>
              <form>
                <Row>
                  <input type='text' className="inpt1" placeholder='Enter Player Name' name='name' value={this.state.name || ""} onChange={this.handleChange} />
                </Row>
                <Row>
                  <span id="error_msg" style={{ color: "Red" }}>{this.state.playerNameError}</span>
                </Row>
                <br />
                <br />
                <Row>
                  <Col>
                    <select value={this.state.type} className="inpt2" name='type' onChange={this.handleChange}>
                      <option value="">Select Player Type</option>
                      <option value="Goal Keeper">Goal Keeper</option>
                      <option value="Forwarder">Center Forward</option>
                      <option value="Mid-Fielder">Mid-Fielder</option>
                      <option value="Defende">Defender</option>
                    </select>
                    <input type='number' className="inpt3" placeholder='Enter Player Age' name='age' value={this.state.age || ""} onChange={this.handleChange} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span id="error_msg" style={{ color: "Red" }}>{this.state.playertypeError}</span>
                    <span id="error_msg" style={{ color: "Red" }}>{this.state.ageError}</span>
                  </Col>
                </Row>
                <br />
                <br />
                <Row>
                  <Col>
                    <input type='number' className="inpt4" placeholder='Enter the No.Of matches' name='noOfMatches' value={this.state.noOfMatches || ""} onChange={this.handleChange} />
                    <input type='number' className="inpt5" placeholder='Enter No.Of Goal Scored' name='goalsScored' value={this.state.goalsScored || ""} onChange={this.handleChange} />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span id="error_msg" style={{ color: "Red" }}>{this.state.gameError}</span>
                    <span id="error_msg" style={{ color: "Red" }}>{this.state.scoreError}</span>
                  </Col>
                </Row>
                <br />
                <br />
                <div className="veiwbtn">
                  <button className='savebtn' disabled={disable}  onClick={this.onSubmit}>Save</button>
                  <button className="clearbtn" onClick={this.ResetForm}>Clear</button>
                </div>
              </form>
            </div>
          </Modal> : null} 
        </div>
    );
  }
}
 
export default Editor;