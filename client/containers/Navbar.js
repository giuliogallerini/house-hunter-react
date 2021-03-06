// dependencies
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { history } from '../store'

// components
import FacebookAuth from '../components/FacebookAuth'
import Logo from '../components/Logo'

// actions
import appLoading from '../actions/loading'
import changePage from '../actions/change-page'

// styles
import './Navbar.sass'

// COSTANTS

const PAGES = [{name: 'favourites', selected: true}, {name: 'offers', selected: false}, {name: 'requests', selected: false}]

class Navbar extends Component {
  componentWillMount(){
    const { currentPage } = this.props
    window.location.pathname !== '/' + currentPage.name  && currentPage.name !== 'favourites' ?
      history.push(currentPage.name) : null
  }

  componentDidMount(){
    const { appLoading } = this.props
    $(window).scroll(function(){
      var scroll = $(window).scrollTop();
      if(scroll <= 100){
        $('.navbar').css({
          'background-color': 'rgba(255,255,255,'+(scroll/100 > 0.60 ? 0.60 : scroll/100 )+')',
          'box-shadow': '1px 1px 15px rgba(0,0,0,'+(scroll/100)+')',
          'color': 'rgb(0,0,0)'
        });

        ((scroll === 0))? $('.navbar').find('li').css('color','white') : $('.navbar').find('li').css('color','rgba(0,0,0,'+(scroll/10)+')');
      }else{

        $('.navbar').css({
          'background-color': 'rgba(255,255,255, 0.60)',
          'box-shadow': '1px 1px 15px rgba(0,0,0, 1)',
          'color': 'rgb(0,0,0)'
        });
        scroll%800 <= 100 && scroll%800 >= 0 ? appLoading(true) : null
        setTimeout(function () {
          $('.navbar').find('li').css('color','rgba(0,0,0,1)');
        }, 10);
      }
    });
  }

  selected(page){
    const { changePage, appLoading, currentPage } = this.props

    if(page.name !== currentPage.name){
      appLoading(true)
      changePage(page)
      history.push(`/${page.name === 'favourites' ? '' : page.name }`)
      setTimeout(() => { appLoading(false) }, 2000)
    }
  }

  renderPageTabs(page, index){
    const { changePage, currentPage } = this.props
    return (
      <div key={ index }>
        <a href='#' onClick={ this.selected.bind(this, { name: page.name, selected: true }) }>
          <li className={ currentPage.name === page.name ? 'selected' : null } >{ page.name }</li>
        </a>
      </div>
    )
  }

  render() {

    return(
      <div className='navbar' >
        <Logo imageUrl={ 'http://cd.sseu.re/house-hunter-logo-white.png' }/>
        <ul>
          { PAGES.map( this.renderPageTabs.bind(this) )}
        </ul>
      </div>

    )
  }
}

Navbar.propTypes = {
  currentPage: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  return {
    currentPage: state.currentPage,
  }
}

export default connect(mapStateToProps, { changePage, appLoading })(Navbar)
