import React, { Component } from 'react'
import axios from 'axios'
// import styled from 'styled-components'
import uuid from "uuid";
import Joke from "./Joke";

export default class JokeList extends Component {

    constructor() {
        super()

        this.seenJookes = new Set(this.state.jokes.map(j => j.text))
    }
    state = {
        jokes: JSON.parse(localStorage.getItem('jokes')) || [],
        isLoading: false
    }

    static defaultProps = {
        numOfJoke: 10
    }

    // get api joke
    getJoke = async () => {
        // show loading icon
        this.setState({ isLoading: true })

        // get jokes
        let joke = []
        while (joke.length < this.props.numOfJoke) {
            let res = await axios.get('https://icanhazdadjoke.com/', {
                headers: {
                    Accept: 'application/json'
                }
            })

            // check that joke not in state
            if (!this.seenJookes.has(res.data.joke)) {
                joke.push({ text: res.data.joke, id: uuid(), vote: 0 })
            }
        }

        // update state and LS
        this.setState(prevState => ({
            jokes: [...prevState.jokes, ...joke],
            isLoading: false
        }), () => {
            localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
        })
    }

    componentDidMount() {

        // get jokes if LS empty
        if (this.state.jokes.length === 0) {
            this.getJoke()
        }
    }

    handleVote = (id, vote) => {
        this.setState(prevState => ({
            jokes: prevState.jokes.map(joke => joke.id === id ? { ...joke, vote: joke.vote + vote } : joke)
        }), () => {
            localStorage.setItem('jokes', JSON.stringify(this.state.jokes))
        })
    }


    render() {

        // sort state with vote and create joke component
        let jokes = this.state.jokes.sort((a, b) => b.vote - a.vote).map(joke => {
            return <Joke
                text={joke.text}
                key={joke.id}
                id={joke.id}
                vote={joke.vote}
                upVote={() => this.handleVote(joke.id, 1)}
                downVote={() => this.handleVote(joke.id, -1)}
            />
        })

        return (
            <div className='JokeList'>
                <div className='sidebar'>
                    <h1>Dad Joke</h1>
                    <div className='joke-emoji'>
                        <i class="em em-blush" ></i>
                    </div>
                    <button onClick={this.getJoke}>new jokes</button>
                </div>

                <div className='content'>
                    {this.state.isLoading ? <div className='loading'>
                        <i className='em em-rolling_on_the_floor_laughing' />
                    </div> : <div className='jokes'>{jokes}</div>}
                </div>
            </div >
        )
    }
}
