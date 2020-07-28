import React from 'react';
import './App.css';
import Axios, {AxiosResponse} from "axios";
export {};

const githubApi = require('./github-api');

interface UsernameState {
    username : string
    errorMsg : string
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
            repos : [],
            orgs : []
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({username : (event.target as HTMLInputElement).value});
        this.setState({repos : []});
        this.setState({orgs : []});
    }

    handleSubmit = (event: React.FormEvent) => {
        githubApi.getRepos(this.state.username)
            .then((response : AxiosResponse<any>) => {
            // @ts-ignore
                response.map(responseItem => {
                    this.setState({ repos: [...this.state.repos, responseItem.name] });
                });
            })
            .catch((error : any) => {
                this.setState({errorMsg : "Username not found"});
                throw error;
            });

        githubApi.getUserData(this.state.username)
            .then((value : {user : AxiosResponse<any>, orgs : AxiosResponse<any> }) => {
            // @ts-ignore
                value.orgs.map(orgsItem => {
                    this.setState({orgs : [...this.state.orgs, orgsItem.login]})
                })
            })
            .catch((error : any) => {
                this.setState({errorMsg : "Username not found"});
                throw error;
            });

        event.preventDefault()
        this.setState({username : ""})
    }


    render() {
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

                <div className={(this.state.username === "" && this.state.orgs.length !== 0 && this.state.repos.length !== 0) ? "givenList" : "givenListNone"}>
                    <div className="listStyle">
                        <p>Repositories</p>
                        <ul>
                            {this.state.repos.map((repoItem) => <li key={repoItem}>{repoItem}</li>)}
                        </ul>
                    </div>
                    <div className="listStyle">
                        <p>Organisations</p>
                        <ul>
                            {this.state.orgs.map((orgItem) => <li key={orgItem}>{orgItem}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
