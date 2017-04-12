import React from 'react'
import classnames from 'classnames'
import Code from 'app/ui/_lib/code'
import Link from 'app/ui/_lib/link'
import {trackAction} from 'app/acts/tracking_acts'
import I from 'immutable'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {GettingStartedPropType} from 'app/types/getting_started'

export default class GettingStarted extends React.Component {
  static propTypes = {
    gettingStarted: GettingStartedPropType.isRequired,
    gettingStartedTabs: ImmutablePropTypes.listOf(React.PropTypes.string.isRequired)
  }

  state = {
    source: 'npm'
  }

  componentWillReceiveProps ({gettingStartedTabs}) {
    if (!gettingStartedTabs.includes(this.state.source)) {
      this._resetSource(gettingStartedTabs)
    }
  }

  render () {
    return <div className='getting_started'>
      {this._renderContent()}

      <div className='getting_started-link_wrapper'>
        <Link
          name='doc'
          params={{docId: 'Getting-Started'}}
          className='getting_started-link'
        >
          Documentation
        </Link>
      </div>
    </div>
  }

  _renderContent () {
    const {gettingStartedTabs, gettingStarted} = this.props

    if (gettingStarted.size === 0) {
      return <div className='getting_started-loading'>Loading</div>
    }

    return <div>
      <ul className='getting_started-options'>
        {
          gettingStartedTabs.map((tab) => {
            return <li className='getting_started-option' key={tab}>
              <a
                href='#'
                onClick={this._changeSource.bind(this, tab)}
                className={classnames('getting_started-option_link', {
                  'is-current': this.state.source === tab
                })}
              >
                {gettingStarted.getIn([tab, 'title'])}
              </a>
            </li>
          })
        }
      </ul>

      {this._renderInstruction()}
    </div>
  }

  _renderInstruction () {
    const currentGettingStarted = this.props.gettingStarted.get(this.state.source, I.Map())

    const link = currentGettingStarted.get('link')

    return <div className='getting_started-instruction'>
      <h4 className='getting_started-instruction_header'>
        Installation
      </h4>
      <Code value={currentGettingStarted.get('install')} options={{theme: 'wormhole', readOnly: true}} />

      <h4 className='getting_started-instruction_header'>
        Example
      </h4>
      <div id='qa-npm'>
        <Code value={currentGettingStarted.get('example')} options={{theme: 'wormhole', readOnly: true}} />
      </div>

      <div>
        {this._renderDownloadLink(link)}
      </div>
    </div>
  }

  _renderDownloadLink (link) {
    if (link) {
      return <a href={link} className='getting_started-download' target='_blank'>
        Download Library
      </a>
    } else {
      return null
    }
  }

  _resetSource (gettingStartedTabs) {
    this.state = {
      source: gettingStartedTabs.first()
    }
  }

  _changeSource (source, e) {
    trackAction('Changed Installation Source', {source})
    e.preventDefault()
    this.setState({source})
  }
}