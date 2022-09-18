import React from 'react';
import './Result.css'



class Result extends React.Component {

    render() {
        let usersList = this.props.usersList

    
       const userListShow = usersList.map((element, index) => {
             return <div
                    key={element.id}
                    className='divList'
                    onClick={() => this.props.selectUser(index)}>
                        <img 
                            className='imageUsers'
                            src={element.avatar_url}>  
                        </img>
                    </div>
        })

         return <div className = 'divResult'>
            <div className = 'resultContainer'>
                {userListShow}
            </div>
         </div>
    }
}


export default Result;