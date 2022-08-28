import React from 'react';
import './ChangePage.css';

class ChangePage extends React.Component {
    render() {
     return <div>
        <i className="arrow left"
            onClick={() => this.props.previousPage()}>
        </i>
        <i 
            className="arrow right"
            onClick={() => this.props.nextPage()}>     
        </i>
     </div>   
    }
}

export default ChangePage;