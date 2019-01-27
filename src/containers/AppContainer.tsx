import {IMessageAppState} from '../models/IMessageApp';
import {connect} from 'react-redux';
import {App, IAppStateProps} from '../components/App';

const mapStateToProps = (state: IMessageAppState): IAppStateProps => {
  return {
    logged: state.currentUser !== null,
    authPageError: state.authPageError,
    asyncOperationsCount: state.asyncOperationsCount,
  };
};

export const AppContainer = connect<IAppStateProps, void>(mapStateToProps)(App);
