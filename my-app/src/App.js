import React from 'react';
import SearchZone from './SearchZone';
import Result from './Result';
import ChangePage from './ChangePage'
import UserInfo from './UserInfo'
import './App.css';


const tokenApi = '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';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue : '',
            className: 'searchButton',
            isLoaded : false,
            userList : [],
            userInfos : {},
            deposInfos : [],
            error : null,
            idUserPage : 0,
            arrayOfId : [0],
            startLoading : false,
            userSelected : false,
            reposPages : [1,0],
            reposUrl : '',

        }
    }

    componentDidMount() {
        const arrayOfId = this.state.arrayOfId;
        fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=27',{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                this.setState({
                    isLoaded: true,
                    userList: result,
                });
            }
        ) 
    }

    componentDidUpdate() {
        const arrayOfId = this.state.arrayOfId;
        if (this.state.startLoading || this.state.userInfos === []) {
            fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=27',{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                 (result) => {
                     this.setState({
                          isLoaded: true,
                          userList: result,
                          startLoading: false,
                      });
                 }
           )
        }

        if (this.state.userInfos.avatar != undefined && this.state.startLoading) {
            this.setState({
                userSelected: true,
                startLoading: false

            })
        }

    }

    nextPage() {

        const arrayOfId = this.state.arrayOfId;
        if (this.state.searchValue === '') {
            fetch('https://api.github.com/users?since=' + arrayOfId[arrayOfId.length -1] + '&per_page=27',{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
        .then(res => {    
            return res.headers.get('link');
        }).then( result => {
            this.setState({
                arrayOfId : arrayOfId.concat(result.slice(result.indexOf('=') + 1,result.indexOf('&'))),
                startLoading: true,
            })
        })

        }
    }

    previousPage() {
        const arrayOfId = this.state.arrayOfId;

        if (arrayOfId.length > 1) {
            arrayOfId.pop()
        }
        if (this.state.searchValue === '') {
            this.setState({
                arrayOfId : arrayOfId,
                startLoading : true,
            })
        }
    }
    
    changeInputValue(e) {
        this.setState({
            searchValue : e.target.value
        })

        if (e.target.value === '') {
            this.setState({
                startLoading : true
            })
        }
    }

    searchResult(e) {
        let userList = this.state.userList.slice();
        console.log(userList);
        fetch('https://api.github.com/users/' + this.state.searchValue,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then((res) => res.json())
        .then((data) => {
            userList = userList.splice(0, userList.length, data)
            console.log(userList)
            this.setState({
                userList: userList
            })        
        })
        e.preventDefault();
    }

    mouseDown() {
        this.setState({
            className : 'searchButtonClicked'
        })
        
    }

    mouseUp() {
        this.setState({
            className : 'searchButton'
        })
    }

    returnPage() {
        this.setState({
            userSelected: false,
            userInfos : {},
            reposPages: [1,0],
            reposUrl : ''
        })
    }

    selectUser(index) {
        this.setState({
            
        })

        this.getUserInfo(index)
    }

    getUserInfo(index) {
        const arrayUser = this.state.userList;
        const userName = arrayUser[index];
        let userInfos = {};
        let userInfosDepos = [];
        let userInfosOrgs = [];

        this.setState({
            reposUrl : this.state.userList[index].repos_url
        })

        userInfos.avatar = userName.avatar_url; 
        userInfos.html_url = userName.html_url;
        userInfos.login = userName.login

        //FETCH LES ORGS
        //console.log(arrayUser[index].organizations_url);
        fetch(userName.organizations_url,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result => {
                result.forEach((element) => {
                    userInfosOrgs.push({
                        avatarOrgs : element.avatar_url,
                        description : element.description,
                        login : element.login,
                        url : element.url
                    })
                })
                userInfos.list_orgs = userInfosOrgs;
            })
        )
            
        
        //FETCH LES REPOS
        fetch(userName.repos_url+ '?per_page=8&page=' + this.state.reposPages[0],{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => {    
            if (res.headers.get('link')) {
                
                let arrayReposMax = [this.state.reposPages[0],null]
                let headersData = res.headers.get('link')

                
                headersData = headersData.slice(headersData.indexOf('&page=', headersData.indexOf(',')))
                arrayReposMax[1] = Number(headersData.slice(headersData.indexOf('=') + 1,headersData.indexOf('>'))) 
                this.setState({
                    reposPages : arrayReposMax,
                })
            }
            return res.json()
        })
        .then(
            (result) => {
                result.forEach((element) => {
                    userInfosDepos.push({
                        name : element.name,
                        description : element.description,
                        size : element.size,
                        language : element.language

                    })
                })
                this.setState({
                    userInfos : userInfos,
                    startLoading : true
                })
            }
        )
        userInfos.depos = userInfosDepos;

        //FETCH LES INFOS PERSOS USERS

        fetch(userName.url,{
            method: "GET",
            headers : {
                Authorization : 'token ' + tokenApi
            }
        })
        .then(res => res.json())
        .then(
            (result) => {
                userInfos.following = result.following
                userInfos.followers = result.followers; 
                userInfos.twitter = result.twitter_username;
                userInfos.location = result.location;
                userInfos.bio = result.bio;
                userInfos.name = result.name;
                this.setState({
                    userInfos : userInfos,
                    startLoading : true
                })
                return userInfos;
            }
        )
        
        
    }

    previousDepos() {
        let arrayDeposPages = this.state.reposPages.slice();
        let newUserArray = this.state.userInfos;
        if(arrayDeposPages[0] > 1){
            arrayDeposPages[0]--
            console.log(this.state.reposUrl + '?per_page=8&page=' + arrayDeposPages[0])
            fetch(this.state.reposUrl + '?per_page=8&page=' + arrayDeposPages[0],{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    //newUserArray.depos = result;
                    console.log(newUserArray);
                    this.setState({
                        userInfos : {
                            ...this.state.userInfos,
                            depos : result},
                            reposPages : arrayDeposPages
                    })
                }
            )
        }

    }

    nextDepos(){
        let arrayDeposPages = this.state.reposPages.slice();
        let newUserArray = this.state.userInfos;
        console.log(arrayDeposPages);
        if(arrayDeposPages[0] < arrayDeposPages[1]){
            arrayDeposPages[0]++
            console.log(this.state.reposUrl + '?per_page=8&page=' + arrayDeposPages[0])
            fetch(this.state.reposUrl + '?per_page=8&page=' + arrayDeposPages[0],{
                method: "GET",
                headers : {
                    Authorization : 'token ' + tokenApi
                }
            })
            .then(res => res.json())
            .then(
                (result) => {
                    //newUserArray.depos = result;
                    console.log(newUserArray);
                    this.setState({
                        userInfos : {
                            ...this.state.userInfos,
                            depos : result},
                            reposPages : arrayDeposPages
                    })
                }
            )
        }

    }

    render() {
        const isUserSelected = this.state.userSelected;
         return <div
                className='container'>
            <SearchZone
                searchResult={(e) => this.searchResult(e)}
                changeInputValue={(e) => this.changeInputValue(e)}
                className={this.state.className}
                classSearchBar={this.state.classSearchBar}
                mouseDown={() => this.mouseDown()}
                mouseUp={() => this.mouseUp()}
             />

            {isUserSelected
            ? <UserInfo
                returnPage = {() => this.returnPage()}
                userInfos = {this.state.userInfos}
                previousDepos = {() => this.previousDepos()}
                nextDepos = {() => this.nextDepos()}
            />
            : <Result 


                valueResult = {this.state.searchValue}
                usersList = {this.state.userList}
                selectUser = {index => this.selectUser(index)}
            />
            }

            {!isUserSelected &&
                <ChangePage
                nextPage = {() => this.nextPage()}
                previousPage = {() => this.previousPage()}
             />
                
            }
         </div> 
    }
}


export default App;