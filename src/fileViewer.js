'use strict';

var React = require('react'),
	FileViewerResolved = require('./fileViewerResolved'),
	fileInfoProvider = require('./fileInfoProvider'),
	i18n = require('react-frau-intl').i18n,
	getMessages = require('./getMessages'),
	IntlFileViewer = i18n(FileViewerResolved);

var FileViewer = React.createClass({
	componentDidMount: function() {
		this.fetchFileInfo(this.props.src);
	},
	componentWillReceiveProps: function(nextProps) {
		if (nextProps.src !== this.props.src) {
			this.setState({info:null});
			this.fetchFileInfo(nextProps.src);
		}
	},
	fetchFileInfo: function(src) {
		var me = this;
		fileInfoProvider(src, function(err, fileInfo) {
			if (!me.isMounted()) {
				return;
			}
			if (err) {
				me.setState({error: err});
				return;
			}
			me.setState({info: fileInfo});
		});
	},
	getInitialState: function() {
		return {
			error: null,
			info: null
		};
	},
	propTypes: {
		src: React.PropTypes.string.isRequired,
		locale: React.PropTypes.string,
		progressCallback: React.PropTypes.func
	},
	render: function() {
		if (this.state.error) {
			return <div>{this.state.error}</div>;
		}
		if (!this.state.info) {
			return null;
		}
		var messages = getMessages(this.props.locale);

		return <IntlFileViewer
			{...this.props}
			messages={messages}
			filename={this.state.info.filename}
			mimeType={this.state.info.mimeType}
			size={this.state.info.size} />;
	}
});

module.exports = FileViewer;
