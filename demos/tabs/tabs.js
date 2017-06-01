const Component = React.Component;
const PropTypes = React.PropTypes;
const app = document.getElementById('app');
class Tabs extends Component {
    
    constructor(props) {
        super(props);

        const currentProps = this.props;
        let activeIndex = 0;

        if('activeIndex' in currentProps) {
            activeIndex = currentProps.activeIndex;
        } else if('defaultActiveIndex' in currentProps) {
            activeIndex = currentProps.defaultActiveIndex;
        }

        this.state = {
            activeIndex,
            preIndex: activeIndex
        }
        this.handler = this._handler.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        if('activeIndex' in nextProps) {
            this.setState({
                activeIndex: nextProps.activeIndex
            })
        }
    }

    _handler(activeIndex) {
        const preIndex = this.state.activeIndex;
        if(this.state.activeIndex!==activeIndex &&
            'defaultActiveIndex' in this.props
        ) {
            this.setState({
                activeIndex,
                preIndex
            })
            this.props.onChange({activeIndex, preIndex});
        }
        
    }

    getTabNav() {
        const {classPrefix, children} = this.props;
        return (
            <TabNav
                key='tab-bar'
                onTabClick={this.handler}
                classPrefix={classPrefix}
                panels={children}
                activeIndex={this.state.activeIndex}
            />
        )
    }

    getTabContent() {
        const {classPrefix, children} = this.props;
        return (
            <TabContent
                key = 'tab-content'
                classPrefix = {classPrefix}
                panels = {children}
                activeIndex = {this.state.activeIndex}
            />
        );
    }

    render() {
       const {className} = this.props;
       let classnames = classNames(className, 'ui-tab')
       return (
           <div className={classnames}>
                {this.getTabNav()}
                {this.getTabContent()}
           </div>    
       )
    }
}

Tabs.defaultProps = {
    classPrefix: 'tabs',
    onChange: () => {}
}

class TabNav extends Component {
    getTabs() {
        const {classPrefix, panels, activeIndex} = this.props;
        return React.Children.map(panels, (child) => {
                if(!child) return;

                const order = parseInt(child.props.order, 10);

                let classnames = classNames({
                    [`${classPrefix}-tab`]: true, 
                    [`${classPrefix}-active`]: activeIndex === order, 
                    [`${classPrefix}-disabled`]: child.props.disabled,
                });
                let events = {};
                if(!child.props.disabled) {
                    events = {
                        onClick: this.props.onTabClick.bind(this, order)
                    }
                }
                let ref = {};
                if(activeIndex===order) {
                    ref.ref = 'activeTab';
                }
                return (
                    <li 
                        role = 'tab'
                        aria-disabled={child.props.disabled ? 'true' : 'false'} 
                        aria-selected={activeIndex === order? 'true' : 'false'}
                        {...events}
                        className={classnames}
                        key={order}
                        {...ref}
                    >
                        {child.props.tab}
                    </li>
                )
        })
    }

    render() {
        const {classPrefix} = this.props;
        const classRoot = classNames({
            [`${classPrefix}-bar`]: true
        });

        const classnames = classNames({
            [`${classPrefix}-nav`]: true
        });
        
        return (
            <div className={classRoot} role='tab-list'>
                <ul className={classnames}>
                    {this.getTabs()}
                </ul>
            </div>
        )
    }
}

class TabContent extends Component {
    getPanels() {
        const {classPrefix, panels, activeIndex} = this.props;

        return React.Children.map(panels, (child) => {
            if(!child) return;

            const order = parseInt(child.props.order, 10);
            const isActive = order === activeIndex;
            return React.cloneElement(child, {
                classPrefix,
                isActive,
                children: child.props.children,
                key: `tab-panel-${order}`
            })
        })
    }
    render() {
        const {classPrefix} = this.props;
        let classnames = classNames({
            [`${classPrefix}-content`]: true
        });
        
        return (
            <div className={classnames}>
                {this.getPanels()}
            </div>
        )
    }
}

class TabPane extends Component {

    render() {
        const {classPrefix, className, isActive, children} = this.props;
        let classnames = classNames({
            [className]: true,
            [`${classPrefix}-panel`]: true,
            [`${classPrefix}-active`]: isActive
        })
        return (
            <div role='panel' className={classnames} aria-hidden={!isActive}>
                {children}
            </div>
        )
    }
}
function change(index) {
    console.log(index);
}
const tabs = (
<Tabs classPrefix={'tabs'} className={'tabs'} defaultActiveIndex={0} onChange={change}>
    <TabPane key={0} order={0} tab={'Tab 1'}>第一个 Tab 里的内容</TabPane>
    <TabPane key={1} order={1} tab={'Tab 2'}>第二个 Tab 里的内容</TabPane>
    <TabPane key={2} order={2} tab={'Tab 3'}>第三个 Tab 里的内容</TabPane>
</Tabs>
)

ReactDOM.render(tabs, app);
