import React from 'react';
import './UserInfo.css'

class UserInfo extends React.Component {

    render() {



        return  <div className='yo'>
             
            <div className='infoUsers'>

            <img 
                className='imageData'
                src={this.props.userInfos.avatar}>  
            </img>

                <h3>{this.props.userInfos.name}</h3>
                <h4>{this.props.userInfos.login}</h4>
                <p>L'utilisateur possède {this.props.userInfos.followers} followers</p>
                <p>{this.props.userInfos.name} suit {this.props.userInfos.following} utilisateurs</p>

                <svg className='svgLocation' xmlns="http://www.w3.org/2000/svg" width="30" zoomAndPan="magnify" 
                viewBox="0 0 30 30.000001" height="30" preserveAspectRatio="xMidYMid meet" 
                version="1.0"><defs><clipPath id="id1">
                <path d="M 5.921875 2.617188 L 25.519531 2.617188 
                L 25.519531 25.839844 L 5.921875 25.839844 Z M 5.921875 2.617188 " 
                clipRule="nonzero"/></clipPath></defs><g clipPath="url(#id1)">
                <path fill="rgb(0%, 0%, 0%)" d="M 15.703125 2.617188 C 10.320312 2.617188 5.953125 6.945312 
                5.953125 12.292969 C 5.953125 14.964844 7.042969 17.382812 8.808594 19.136719 L 
                15.703125 25.839844 L 22.601562 19.132812 C 24.367188 17.382812 25.460938 14.964844 
                25.457031 12.292969 C 25.457031 6.949219 21.089844 2.617188 15.703125 2.617188 Z M 21.222656 
                17.761719 L 15.703125 23.132812 L 10.175781 17.75 C 8.714844 16.304688 7.902344 14.359375
                 7.902344 12.292969 C 7.902344 8.023438 11.402344 4.550781 15.703125 4.550781 C 17.789062 
                 4.550781 19.75 5.359375 21.222656 6.820312 C 22.695312 8.28125 23.507812 10.226562 23.507812
                  12.292969 C 23.507812 14.359375 22.695312 16.300781 21.222656 17.761719 Z M 21.222656 17.761719 " 
                  fillOpacity="1" fillRule="nonzero"/></g>
                  <path fill="rgb(0%, 0%, 0%)" d="M 15.703125 7.453125 L 10.828125 12.292969 L 12.292969 12.292969 
                  L 12.292969 16.164062 L 14.730469 16.164062 L 14.730469 13.261719 L 16.679688 13.261719 
                  L 16.679688 16.164062 L 19.117188 16.164062 L 19.117188 12.292969 L 20.582031 12.292969 
                  Z M 15.703125 7.453125 " fillOpacity="1" fillRule="nonzero"/>
                  </svg>

                <p className='pLocation '>{this.props.userInfos.name} vit à {this.props.userInfos.location}</p>

            </div>

            <div className='repoShow'>
                {this.props.userInfos.depos.map((element, index) => {
                    return <div 
                            className='reposList'
                            key={index}>
                            <p>{element.language}</p>
                            </div> 
                })}
                <button onClick={() => this.props.previousDepos()} > Back </button>
                <button onClick={() => this.props.nextDepos()}> Next </button>
            </div>

                
            <div className = 'orgDiv'>
            
            {this.props.userInfos.list_orgs.map((element, index) => {
                return  <a 
                        href= {'https://github.com/' + this.props.userInfos.list_orgs[index].login}
                        key={index}
                        target='_blank'>
                            <img 
                            className='imageOrg'
                            src={this.props.userInfos.list_orgs[index].avatarOrgs}>  
                            </img>
                        </a>
            })}
            </div>

            <button
            className='button'
            onClick={() => this.props.returnPage('')}
            >
            Return
            </button>

        </div>



    }
}

export default UserInfo;