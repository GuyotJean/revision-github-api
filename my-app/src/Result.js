import React from "react";
import "./Result.css";

class Result extends React.Component {
  render() {
    let usersList = this.props.usersList;

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
            <div className={"buttonProfil " + "profil" + index}>
              <h4 className="profilTextLink">Voir Profil</h4>
            </div>
          </div>
        </div>
      );
    });

    return <div className="divResult">{userListShow}</div>;
  }
}

export default Result;
