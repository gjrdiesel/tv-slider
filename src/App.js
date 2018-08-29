import React, {Component} from 'react';
import axios from "axios";
import styled from "styled-components"

const StylizedDiv = styled.div`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: black;
    color: white;
    z-index: 9999;
    width: 100%;
    height: 100%;
`;

const StylizedSlide = styled(StylizedDiv)`
    z-index: ${props => 10000 + props.num};
    opacity: ${props => props.isActive ? 1 : 0}
    transition: 2s all;
`;

function splitByHash(html) {
    return html.split('<input type="hidden" name="hash" value=')[0];
}

class Slide extends Component {

    state = {
        html: ''
    };

    componentDidMount() {
        this.fetchHTML();
        setInterval(this.fetchHTML, 10000);
    }

    fetchHTML = async () => {
        if (this.props.image) {
            this.setState({html: `<img style="width:100%;height:100%;" src="${this.props.image}"/>`});
            return;
        }

        try {
            let currentWebPage = await axios.get(this.props.link);
            let previousWebPage = await localStorage.getItem(this.props.link);

            console.log('Comparing web pages');

            if (currentWebPage.data !== previousWebPage) {
                console.log('Updating web pages');
                await localStorage.setItem(this.props.link, currentWebPage.data);
                this.setState({html: currentWebPage.data});
            } else {
                console.log('NOT Updating web pages');
            }
        } catch (err) {
            console.error(err);
        }

    };

    render() {
        const {props} = this;
        return <StylizedSlide {...props}>
            <div style={{display: 'flex', flex: 1}} dangerouslySetInnerHTML={{__html: this.state.html}}/>
        </StylizedSlide>
    }
}

class App extends Component {

    state = {
        slides: []
    };

    slideTimeout = 0;

    getTimeoutInSeconds(time) {
        return (time || 5) * 1000;
    }

    handleSlideTimeout = () => {
        let id = null;
        let {slides} = this.state;
        let activeSlide = slides.findIndex(slide => slide.isActive === true);

        if (slides[activeSlide + 1]) {
            id = activeSlide + 1;
        } else {
            id = 0;
        }

        slides = slides.map(slide => {
            slide.isActive = false;
            return slide;
        });

        slides[id].isActive = true;
        this.setState({slides});

        this.slideTimeout = setTimeout(this.handleSlideTimeout, this.getTimeoutInSeconds(slides[id].timeout));
    };

    checkIfSettingsChanged = async () => {
        try {
            let currentSettings = await localStorage.getItem('self_content');
            let newSettings = await axios.get(window.location.href);

            if (splitByHash(currentSettings) !== splitByHash(newSettings.data)) {
                await localStorage.setItem('self_content', newSettings.data);
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    componentDidMount() {
        let slides = [];
        document.querySelectorAll('.tv-slider-items').forEach(options => {
            eval("options = " + options.innerHTML + ";");
            options.isActive = false;
            slides.push(options);
        });
        slides[0].isActive = true;
        this.slideTimeout = setTimeout(this.handleSlideTimeout, this.getTimeoutInSeconds(slides[0].timeout));
        this.setState({slides});

        setInterval(this.checkIfSettingsChanged, 10000);
    }

    render() {
        return (<StylizedDiv>
            {this.state.slides.map((slide, num) => <Slide {...slide} num={num} key={num}/>)}
        </StylizedDiv>);
    }
}

export default App;