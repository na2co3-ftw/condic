var Dicman = require("./1line-dic.js");
var arka = new Dicman("arka.txt");
var arkadic = [];
arka.searchByKey("", 1, function(entry) {
	if (!entry) {
		return;
	}
	arkadic.push(entry);
});

import React from 'react';
import ReactDOM from 'react-dom';

class WordListView extends React.Component {
	constructor(props) {
		super(props);
	}

	nl2br(text) {
		var regex = /(\n)/g;
		return text.split(regex).map(function (line) {
			if (line.match(regex)) {
				return <br />;
			} else {
				return line;
			}
		});
	}

	render() {
		return(
			<dl>
				{this.props.entries.map(entry => [
					<dt>{entry.word}</dt>,
					<dd>{this.nl2br(entry.exp)}</dd>
				])}
			</dl>
		);
	}
}

class MainWindow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {text: '', entries: []}
	}

	onInput(e) {
		this.setState({text: e.target.value, entries: []});

		setTimeout(() => {
			arka.searchByKey(this.state.text, 1, entry => {
				if (!entry) {
					//var endTime = new Date();
					//$("#num").text(count + " words [" + (endTime.getTime() - startTime.getTime()) + "ms]");
					return;
				}
				this.setState({entries: [...this.state.entries, entry]});
			});
		}, 0);
	}

	render() {
		return (
			<div>
				<input onInput={this.onInput.bind(this)} value={this.state.text} />
				<WordListView entries={this.state.entries} />
			</div>
		);
	}
}

ReactDOM.render(
	<MainWindow />,
	document.getElementById('container')
);

/*
var out;
$(function() {
	out = $("#out");
	$("#searchInput").on("input", function(e) {
		out.empty();
		//$("#num").empty();
		var val = $(this).val();
		if (!val) {
			return;
		}

		var count = 0;
		var startTime = new Date();

		//*
		setTimeout(function() {
			arka.searchByKey(val, 1, function(entry) {
				if (!entry) {
					var endTime = new Date();
					$("#num").text(count + " words [" + (endTime.getTime() - startTime.getTime()) + "ms]");
					return;
				}
				$("<dt>").text(entry.word).appendTo(out);
				$("<dd>").html(entry.exp.replace(/\n/g, "<br>")).appendTo(out);
				count++;
			});
		}, 0);
	});
});
*/
