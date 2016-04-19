import React from 'react';
import ReactDOM from 'react-dom';
import PureRenderMixin from 'react-addons-pure-render-mixin'

var Dicman = require("./1line-dic.js");
var arka = new Dicman("arka.txt");
var arkadic = [];
arka.searchByKey("", 1, function(entry) {
	if (!entry) {
		return;
	}
	arkadic.push(entry);
});


function escapeBr(str) {
	return str.split(/(\n)/g).map(line => line === '\n' ? <br /> : line);
}

class WordView extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
	}

	render() {
		return (
			<div className="entry">
				<p className="word">{this.props.entry.word}</p>
				<div className="declair">{escapeBr(this.props.entry.exp)}</div>
			</div>
		);
	}
}

class WordListView extends React.Component {
	render() {
		return (
			<div id="word-list">
				{this.props.entries.map(entry =>
					<WordView entry={entry} key={entry.word} />
				)}
			</div>
		);
	}
}

class MainWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text: '', entries: []};
		this.onChange = this.onChange.bind(this);
	}

	onChange(e) {
		this.setState({text: e.target.value, entries: []});

		setTimeout(() => {
			arka.searchByKey(this.state.text, 1, entry => {
				if (!entry) {
					return;
				}
				this.setState({entries: [...this.state.entries, entry]});
			});
		}, 0);
	}

	render() {
		return (
			<div>
				<input onChange={this.onChange} value={this.state.text} />
				<WordListView entries={this.state.entries} />
			</div>
		);
	}
}

ReactDOM.render(
	<MainWindow />,
	document.getElementById('container')
);
