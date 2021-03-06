import React from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {connect} from "react-redux";
import * as action from "./PublicAction";

import TimelineCell from "../../timeline/TimelineCell";
import RefreshListView from "../../../global/components/refresh/RefreshListViewFlickr";
import BaseProps from "~/global/base/BaseProps";
import NavigationManager, {navigateN} from "~/global/navigator/NavigationManager";
import RefreshFooter from "~/global/components/refresh/RefreshFooter";
import RefreshState from "~/global/components/refresh/RefreshState";
import Logger from "~/global/util/Logger";
import {SearchAction} from "~/biz/search/SearchAction";

interface Props extends BaseProps {
    refreshTimeline: Function,
    getSearchWordList: Function,
    ptrState: string,
    pageList: Array<any>,
    search_searches_list: Array<any>,
}

const TAG = "PublicCmpt"

class PublicCmpt extends React.PureComponent<Props> {
    private scrollview: any;

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        Logger.log(TAG, 'PublicCmpt componentWillMount', this.props);
        this.props.refreshTimeline([])
        this.props.getSearchWordList()
    }

    componentDidMount() {
        Logger.log(TAG, 'PublicCmpt componentDidMount', this.props);
    }

    render() {
        Logger.log(TAG, "PublicCmpt render", this.props);
        return <RefreshListView
            ListHeaderComponent={this._renderHeader()}
            ptrState={this.props.ptrState}
            data={this.props.pageList ? this.props.pageList : []}
            renderItem={this._renderItem}
            keyExtractor={(item) => item.id}
            ListFooterComponent={this._renderFooter(this.props.pageList)}
            onHeaderRefresh={() => {
                Logger.log(TAG, "onHeaderRefresh");
                this.props.refreshTimeline(this.props.pageList)
                this.props.getSearchWordList()
            }}
        />
    }

    _renderFooter = (data) => {
        if (data && data.length > 0) {
            return (<RefreshFooter ptrState={RefreshState.LoadingMoreEnd}/>)
        } else {
            return null
        }
    };
    _renderHeader = () => {
        if (!this.props.search_searches_list) return null
        Logger.log(TAG, "_renderHeader")
        let keywordViews = []
        let keywords = this.props.search_searches_list
        Logger.log(TAG, "_renderHeader", keywords)
        for (let i = 0; i < keywords.length; i++) {
            keywordViews.push(
                <TouchableOpacity key={i} style={styles.keywordItem} onPress={
                    () => navigateN(NavigationManager.mainNavigation, "SearchPage", {
                        url: `/q/${keywords[i].query}`,
                        queryId: keywords[i].id,
                    })
                }>
                    <Text>{keywords[i].query}</Text>
                </TouchableOpacity>
            );
        }
        return <ScrollView ref={(r) => this.scrollview = r}
            // maxWidth={'180%'}
            // maxHeight={85}
                           style={styles.keywordContainer} horizontal={true}
                           showsHorizontalScrollIndicator={false}>
            {keywordViews}
        </ScrollView>
    }

    _renderItem = (data) => {
        let item = data.item;
        return (
            <TimelineCell item={item}/>
        )
    };
    onSearchCallback = (data) => {
        this.props.getSearchWordList()
        if (data.isCreate) {
            //TODO do nothing
        } else {
            this.scrollview.scrollTo({x: 0, y: 0, animated: false});
        }
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keywordContainer: {
        flexWrap: "wrap",
        flexDirection: 'row',
        padding: 3,
        marginBottom: -5,//ListView Item的MarginTop = 5
    },
    keywordItem: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#000000',
        height: 35,
        margin: 3,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 1,
        backgroundColor: '#FFFFFF',
    }
});

export default connect(
    (state) => ({
        theme: state.themeReducer.theme,
        pageList: state.PublicReducer.pageList,
        ptrState: state.PublicReducer.ptrState,
        search_searches_list: state.SearchReducer.search_searches_list,
    }),
    (dispatch) => ({
        refreshTimeline: (pageList) => dispatch(action.refreshTimeline(pageList)),
        getSearchWordList: () => dispatch(SearchAction.getSearchWordList()),
    })
)(PublicCmpt)
