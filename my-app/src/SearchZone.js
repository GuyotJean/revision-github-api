import React from 'react';
import './SearchZone.css'


class SearchZone extends React.Component {

    render() {
         return <div
                className="searchZone">
                    <form
                    onSubmit={(e) => this.props.searchResult(e)}>

                        <input 
                        className='searchBar'
                        onChange={(e) => this.props.changeInputValue(e)}
                        type="text" 
                        placeholder="Search...">
                        </input>

                        <button
                        className={this.props.className}
                        onMouseDown={() => this.props.mouseDown()}
                        onMouseUp={() => this.props.mouseUp()}
                        onMouseLeave={() => this.props.mouseUp()}>
                        </button>

                    </form>
                </div>
            }
}


export default SearchZone;