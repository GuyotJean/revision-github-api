import React from 'react';
import './ChangePage.css';

class ChangePage extends React.Component {
    render() {
    return <div className = "buttonsDivContainer">
        <div>
            {this.props.arrayOfId.length > 1 &&
            <div 
            className = "buttons previous red"
            onClick={() => this.props.previousPage()}>
                <h4 className = 'buttonP'>Prev</h4>
            </div>
            }

            {this.props.numberPageResult[0] > 1 &&
            <div 
            className = "buttons previous red"
            onClick={() => this.props.previousPage()}>
                <h4 className = 'buttonP'>Prev</h4>
            </div>
            }

            {this.props.numberPageResult[0] < this.props.numberPageResult[1] &&
            <div 
            className = "buttons next red"
            onClick={() => this.props.nextPage()}>
                <h4 className = 'buttonP'>Next</h4>
            </div>
            }

            {this.props.numberPageResult.length === 0 &&
            <div 
            className = "buttons next red"
            onClick={() => this.props.nextPage()}>
                <h4 className = 'buttonP'>Next</h4>

            </div>
            }

        </div>
    </div>       
    }
}

export default ChangePage;