import React from "react";
import "./Result.css";
import { Link } from "react-router-dom";

class Result extends React.Component {
  render() {
    let usersList = this.props.usersList;

    console.log(usersList);

    const userListShow = usersList.map((element, index) => {
      return (
        <div
          key={element.id}
          className="blackDiv"
          onClick={() => this.props.selectUser(index)}
        >
          <div
            className="imgDiv"
            style={{
              backgroundImage: `url(${element.avatar_url})`,
            }}
          ></div>
          <div className="wrapButtonProfil">
            <Link to = {"/profil/:id"}>
            <div className={"buttonProfil " + "profil" + index}>
              <h4 className="profilTextLink">Voir Profil</h4>
            </div>
            </Link>
          </div>
        </div>
      );
    });

    return <div className="divResult">{userListShow}</div>;
  }
}

export default Result;
