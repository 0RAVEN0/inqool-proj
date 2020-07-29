import React from 'react';
import './App.css';
import {AxiosResponse} from "axios";
export {};

const githubApi = require('./github-api');

interface UsernameState {
    username : string
    errorMsg : string
    loading : boolean
    repos : string[]
    orgs : string[]
}
interface UsernameProps {}

class App extends React.Component<UsernameProps, UsernameState>{
    constructor(props: UsernameState) {
        super(props);
        this.state = {
            username : '',
            errorMsg : '',
            loading : false,
            repos : [],
            orgs : []
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username : (event.target as HTMLInputElement).value});
        this.setState({loading : false});
        this.setState({repos : []});
        this.setState({orgs : []});
    }

    handleSubmit = (event: React.FormEvent) => {
        this.setState({loading : true})

        githubApi.getRepos(this.state.username)
            .then((response : AxiosResponse<any>) => {

                // @ts-ignore
                if (response.length === 0){
                    this.setState({repos : [...this.state.repos, "No repositories"]})
                }
                else{
                    // @ts-ignore
                    response.map(responseItem => {
                        //adding repository name into repos array
                        this.setState({ repos: [...this.state.repos, responseItem.name]});
                        return 0;
                    });
                }
                this.setState({loading : false});
                return;
            })
            .catch((error : any) => {
                //if username not found - error
                this.setState({loading : false});
                this.setState({errorMsg : "Username not found"});
                throw error;
            });

        githubApi.getUserData(this.state.username)
            .then((value : {user : AxiosResponse<any>, orgs : AxiosResponse<any> }) => {

                // @ts-ignore
                if (value.orgs.length === 0){
                    this.setState({orgs : [...this.state.orgs, "No organizations"]})
                }
                else{
                    // @ts-ignore
                    value.orgs.map(orgsItem => {
                        //adding name of organisation into orgs array
                        this.setState({orgs : [...this.state.orgs, orgsItem.login]})
                        return 0;
                    });
                }

                this.setState({loading : false});
                return;
            })
            .catch((error : any) => {
                //error when not found username
                this.setState({loading : false});
                this.setState({errorMsg : "Username not found"});
                throw error;
            });

        event.preventDefault()
        this.setState({username : ""})
    }

    render() {
        const { loading } = this.state
        return (
            <div className="add-user">
                <form onSubmit={this.handleSubmit} className="inputStyle">
                    <input
                        autoFocus
                        type="text"
                        name=""
                        value={this.state.username}
                        placeholder="Enter username"
                        onChange={this.handleChange}
                        required/>
                    <p>{this.state.errorMsg}</p>
                </form>
                { loading && <i className="fa fa-spinner fa-spin" aria-hidden="true"/> }
                <div className={(this.state.username === "" && this.state.orgs.length !== 0 && this.state.repos.length !== 0)
                                ? "givenList"
                                : "givenListNone"}>
                    <div className="listStyle">
                        <p>{this.state.repos.length === 1
                            ? "Repository"
                            : "Repositories"}</p>
                        <ol>
                            {this.state.repos.map((repoItem) => <li key={repoItem}>{repoItem}</li>)}
                        </ol>
                    </div>
                    <div className="listStyle">
                        <p>{this.state.orgs.length === 1
                            ? "Organisation"
                            : "Organisations"}</p>
                        <ol>
                            {this.state.orgs.map((orgItem) => <li key={orgItem} className={ this.state.orgs.length === 1 ? "listElementNone" : ""}>{orgItem}</li>)}
                        </ol>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
