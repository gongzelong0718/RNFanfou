import React from 'react';
import {connect} from "react-redux";
import RefreshListView from "../../../global/components/refresh/RefreshListViewFlickr";
import UserCell from "../UserCell";
import PageCmpt from "~/global/components/PageCmpt";
import BaseProps from "~/global/base/BaseProps";
import {goBack} from "~/global/navigator/NavigationManager";
import MentionAction from "~/biz/compose/mention/MentionAction";
import Logger from "~/global/util/Logger";
import RefreshState from "~/global/components/refresh/RefreshState";

const action = new MentionAction()
const TAG = "MentionPage"

interface Props extends BaseProps {
    refreshFriends: Function,
    loadMoreFriends: Function,
    pageData: [],
    ptrState: string,
}

interface State {
    checkedMap: object
}

class MentionPage extends React.PureComponent<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            checkedMap: {},
        }
    }

    componentDidMount() {
        this.props.refreshFriends()
    }

    render() {
        let {pageData, ptrState} = this.props
        pageData = pageData ? pageData : []
        ptrState = ptrState ? ptrState : RefreshState.Refreshing
        return <PageCmpt title={"选择好友"} backNav={this.props.navigation} rightNavButtonConfig={{
            icon: "check",
            callback: this.sure
        }}>
            <RefreshListView
                data={pageData}
                ptrState={ptrState}
                renderItem={this._renderItem}
                keyExtractor={(item) => item.id}
                onHeaderRefresh={() => {
                    console.log("onHeaderRefresh");
                    this.props.refreshFriends()
                }}
                extendedState={this.state.checkedMap}
                onFooterRefresh={() => {
                    console.log("onFooterRefresh");
                    this.props.loadMoreFriends(this.props.pageData)
                }}
            />
        </PageCmpt>
    }

    sure = () => {
        this.props.navigation.state.params.callback(this.state.checkedMap)
        goBack(this.props)
    };

    _renderItem = (data) => {
        Logger.log(TAG, "_renderItem ", this.state.checkedMap)
        let user = data.item;
        return (<UserCell showCheckBox={true}
                          checkMap={this.state.checkedMap} user={user} theme={this.props.theme}
                          onPress={() => {
                              // TipsUtil.toast("点击了" + user.name)
                              let stateMap = this.state.checkedMap
                              let tmpMap = {}
                              for (let key in stateMap) {
                                  tmpMap[key] = stateMap[key];
                              }
                              if (tmpMap[user.name]) {
                                  tmpMap[user.name] = false
                              } else {
                                  tmpMap[user.name] = true //表示选中, user.name是唯一的
                              }
                              this.setState({
                                  checkedMap: tmpMap
                              })
                              // Logger.log(TAG, "onPress ", tmpMap)
                          }}/>
        )
    };
}

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageData: state.MentionReducer.actionData,
        ptrState: state.MentionReducer.ptrState,
    }),
    (dispatch) => ({
        loadMoreFriends: (oldPageData) => dispatch(action.loadMoreFriends(oldPageData)),
        refreshFriends: () => dispatch(action.refreshFriends())

    })
)(MentionPage)
