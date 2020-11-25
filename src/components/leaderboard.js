import React, { Component } from 'react';
import axios from "axios";
import { NavLink } from 'react-router-dom';
import "../css/leaderboard.css"

class LeaderBoard extends Component {
  state = {
    team: [],
    mapping: [],
    admin: false,
    semi1Player1: "",
    semi1Player2: "",
    semi2Player1: "",
    semi2Player2: "",
    finalPlayer1: "",
    finalPlayer2: "",
    winner: "",
  }

  async componentDidMount() {
    await this.getDetails();
  }

  getDetails = async () => {
    let response
    let response2
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
        admin: true,
      })
      await axios.get(`/api/mapping/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response2 = res.data))
      .catch(err => alert(err))
      this.setState({
        mapping: response2,
        admin: true,
      })
      this.displayDetails()
      return {response , response2};
    }
    else{
      await axios.get(`/api/mapping/view`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => (response2 = res.data))
      .catch(err => alert(err.response2.data.errmsg))
      this.setState({
        mapping: response2,
        admin: false
      })
      this.displayDetails()
      return {response , response2};
    }
  };

  mappingLeader = async (data , team1) => {
    let response
    if(this.state.admin){
      if(data === "clear"){
        let details = this.state.mapping.find(details =>(details.category === team1))
        let id = details._id
        await axios
        .patch(`/api/mapping/update/${id}`, {
          name: "",
          category: team1,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
        )
        .then((res) => (response = res.status))
        .catch(err => alert(err))
        await this.getDetails()
      return response;
      }
      else{
        let details = this.state.mapping.find(details =>(details.category === team1))
        let id = details._id
      await axios
      .patch(`/api/mapping/update/${id}`, {
        name: data,
        category: team1,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
      )
      .then((res) => (response = res.status))
      .catch(err => alert(err))
      await this.getDetails()
      return response;
      }
    }
  }

  displayDetails = () => {
    let data1 = this.state.mapping[0]
    let data2 = this.state.mapping[1]
    let data3 = this.state.mapping[2]
    let data4 = this.state.mapping[3]
    let data5 = this.state.mapping[4]
    let data6 = this.state.mapping[5]
    let data7 = this.state.mapping[6]
    this.setState({
      finalPlayer1: data1.name,
      finalPlayer2: data2.name,
      winner: data3.name,
      semi1Player1: data4.name,
      semi1Player2: data5.name,
      semi2Player1: data6.name,
      semi2Player2: data7.name
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
      <div>
        <h2 style={mystyle}>
          FootBall Tournament Management
        </h2>
        <h3 style={h2}>
          <NavLink className="lblink" to={'/teamDetails'}>Team Details</NavLink>
          Leader Board
        </h3>
        {this.state.admin ? <div>
        {this.state.team.length < 4 ? <h2>Kindly Add Four or Above teams to view Leader Board</h2> :
          <div>
            <h2>Teams's Leader Board</h2>
             <div className="teams" >
            <h2>Teams Names</h2>
            {this.state.team.map((name , id) => (
                <div key={id}>
                  {name.name !== this.state.semi1Player2 && name.name !== this.state.semi2Player1 && name.name !== this.state.semi2Player2 ? <li className="listli" onClick={() => this.mappingLeader(name.name , "Team 1")}>{name.name}</li> : null}
                </div>
              ))}
            </div>
            <div className="teams1" >
            <h2>Teams Names</h2>
            {this.state.team.map((name , id) => (
                <div key={id}>
                  {name.name !== this.state.semi1Player1 && name.name !== this.state.semi2Player1 && name.name !== this.state.semi2Player2 ? <li className="listli" onClick={() => this.mappingLeader(name.name , "Team 2")}>{name.name}</li> : null}
                </div>
              ))}
            </div>
            <div className="teams2" >
            <h2>Teams Names</h2>
            {this.state.team.map((name , id) => (
                <div key={id}>
                  {name.name !== this.state.semi1Player1 && name.name !== this.state.semi1Player2 && name.name !== this.state.semi2Player2 ? <li className="listli" onClick={() => this.mappingLeader(name.name , "Team 3")}>{name.name}</li> : null}
                </div>
              ))}
            </div>
            <div className="teams3" >
            <h2>Teams Names</h2>
            {this.state.team.map((name , id) => (
                <div key={id}>
                  {name.name !== this.state.semi1Player1 && name.name !== this.state.semi1Player2 && name.name !== this.state.semi2Player1 ? <li className="listli" onClick={() => this.mappingLeader(name.name , "Team 4")}>{name.name}</li> : null}
                </div>
              ))}
            </div>
            <div className="teams4" >
            <h2>Semi Final 1</h2>
            {this.state.semi1Player1.length === 0 ? null :
            <> 
              <li className="listli" onClick={() => this.mappingLeader(this.state.semi1Player1 , "Semi-Final 1")}>{this.state.semi1Player1}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" , "Team 1")}>X</button>
            </>
            }
            {this.state.semi1Player2.length === 0 ? null : 
              <>
              <li className="listli" onClick={() => this.mappingLeader(this.state.semi1Player2 , "Semi-Final 1")}>{this.state.semi1Player2}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" , "Team 2")}>X</button>
              </>
            }
            </div>
            <div className="teams5" >
            <h2>Semi Final 2</h2>
            {this.state.semi2Player1.length === 0 ? null : 
            <>
              <li className="listli" onClick={() => this.mappingLeader(this.state.semi2Player1 , "Semi-Final 2")}>{this.state.semi2Player1}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" ,  "Team 3")}>X</button>
            </>
            }
            {this.state.semi2Player2.length === 0 ? null : 
            <>
              <li className="listli" onClick={() => this.mappingLeader(this.state.semi2Player2 , "Semi-Final 2")}>{this.state.semi2Player2}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" , "Team 4")}>X</button>
            </>
            }
            </div>
            <div className="teams6" >
            <h2>Finals</h2>
            {this.state.finalPlayer1.length === 0 ? null : 
            <>
              <li className="listli" onClick={() => this.mappingLeader(this.state.finalPlayer1 , "Final")}>{this.state.finalPlayer1}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" ,  "Semi-Final 1")}>X</button>
            </>
            }
            {this.state.finalPlayer2.length === 0 ? null : 
            <>
              <li className="listli" onClick={() => this.mappingLeader(this.state.finalPlayer2 , "Final")}>{this.state.finalPlayer2}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" , "Semi-Final 2")}>X</button>
            </>
            }
            </div>
            <div className="teams7" >
            <h2>winner</h2>
            {this.state.winner.length === 0 ? <li className="listli">Please Select A Winner</li> : 
            <>
              <li className="listli">{this.state.winner}</li>
              <button className="button1" onClick={() => this.mappingLeader("clear" , "Final")}>X</button>
            </>
            }
            </div>
          </div>
          }
          </div>
        : <div>
          <h2>Teams's Leader Board</h2>
        <div className="semi1" >
          <h2>Semi Final 1</h2>
          {this.state.semi1Player1.length === 0 ? null :
            <li className="listli" >{this.state.semi1Player1}</li>
          }
          {this.state.semi1Player2.length === 0 ? null : 
            <li className="listli">{this.state.semi1Player2}</li>
          }
          </div>
          <div className="semi2" >
          <h2>Semi Final 2</h2>
          {this.state.semi2Player1.length === 0 ? null : 
            <li className="listli">{this.state.semi2Player1}</li>
          }
          {this.state.semi2Player2.length === 0 ? null : 
            <li className="listli" >{this.state.semi2Player2}</li>
          }
          </div>
          <div className="final" >
          <h2>Finals</h2>
          {this.state.finalPlayer1.length === 0 ? null : 
            <li className="listli">{this.state.finalPlayer1}</li>
          }
          {this.state.finalPlayer2.length === 0 ? null : 
            <li className="listli">{this.state.finalPlayer2}</li>
          }
          </div>
          <div className="winner" >
          <h2>winner</h2>
          {this.state.winner.length === 0 ? null : 
            <li className="listli">{this.state.winner}</li>
          }
          </div>
          </div>}
      </div>
    );
  }
}
 
export default LeaderBoard;