import React, { Component } from 'react';
import logo from './logo.svg';
import './trivia.css';
import { Card, Grid, Segment } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';


class TriviaApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      isLoading: null,
      numCorrect: 0,
      numIncorrect: 0,
      questionNum: 1,
      gameover: false
    };
    this.clickHandle = this.clickHandle.bind(this);
  }

  componentDidMount() {
    const renderHTML = (rawHTML) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });

    this.setState({
      isLoading: true
    })
    fetch('https://opentdb.com/api.php?amount=26&difficulty=easy&type=multiple')
    .then(response => response.json())
    .then(data => data.results.map(question => (
      {
        question: `${question.question}`,
        answer: `${question.correct_answer}`,
        wrong_answers: `${question.incorrect_answers}`
      }
    )))
    .then(questions => this.setState({
      questions: questions,
      isLoading: false,
    }))
    .catch(error => console.log('failed API call', error))
  }
  
  clickHandle(response) {
    if (response !== 'correct') {
      this.setState({
        numIncorrect: this.state.numIncorrect + 1,
        questionNum: this.state.questionNum + 1
      });
    }
    else {
      this.setState({
        numCorrect: this.state.numCorrect + 1,
        questionNum: this.state.questionNum + 1
      });
    }
    if (this.state.questionNum === 25) {
      this.setState({
        gameover: true
      })
    }
  }

  render() {
    let message = (this.state.gameover === false) ? <h3>See how well you do answering these 25 questions</h3> : <h3>Here are your results</h3>;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Pub Trivia</h1>
        </header>
        {message}
        <Grid columns={(this.state.gameover === false) ? 2 : 1} stackable container>
          <TriviaCard questionNum={this.state.questionNum} isLoading={this.state.isLoading} state={this.state} clickHandle={this.clickHandle}/>
          <Tally numCorrect={this.state.numCorrect} numWrong={this.state.numIncorrect}/>
        </Grid>
      </div>
    );
  }
}

class TriviaCard extends React.Component {

  handleClick(response) {
      let answer = this.props.state.questions[this.props.questionNum].answer;
      if (response === answer) {
        this.props.clickHandle('correct');
      }
      else {
        this.props.clickHandle('incorrect');
      }
  }

  render(){
    if (this.props.isLoading === false && this.props.questionNum < 26) {
      let data = this.props.state;
      let num = this.props.questionNum;
      let question = data.questions[num].question;
      let answer = data.questions[num].answer;
      let wrong_answers = data.questions[num].wrong_answers;
      let optionList = wrong_answers.split(',');
      optionList.push(answer);

      // shuffle array
      for (var i = optionList.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = optionList[i];
        optionList[i] = optionList[j];
        optionList[j] = temp;
      }

      // decode html entities
      const renderHTML = (rawHTML) => React.createElement("span", { dangerouslySetInnerHTML: { __html: rawHTML } });

      return (
        <Grid.Column>
          <Segment>
            <Card fluid color='blue' header={'Question ' + num} />
            <p><strong>Question: </strong>{renderHTML(question)}</p>
            <button className="ui button" onClick={() => this.handleClick(optionList[0])}>{renderHTML(optionList[0])}</button>
            <button className="ui button" onClick={() => this.handleClick(optionList[1])}>{renderHTML(optionList[1])}</button>
            <button className="ui button" onClick={() => this.handleClick(optionList[2])}>{renderHTML(optionList[2])}</button>
            <button className="ui button" onClick={() => this.handleClick(optionList[3])}>{renderHTML(optionList[3])}</button>
          </Segment>
        </Grid.Column>
      );
    }
    else {
      return null;
    }
  }
}

class Tally extends React.Component {
  render() {
    let correct = this.props.numCorrect;
    let wrong = this.props.numWrong;
    let percent = Math.round((correct / (correct + wrong)) * 100);
    return (
      <Grid.Column>
        <Segment><Card fluid color='blue' header='Results' />
          <p><strong>Number Correct: </strong>{correct}</p>
          <p><strong>Number Wrong: </strong>{wrong}</p>
          <p><strong>Percentage Correct: </strong>{(isNaN(percent)) ? '' : percent + '%'}</p>
        </Segment>
      </Grid.Column>
    );
  }
}

export default TriviaApp;
