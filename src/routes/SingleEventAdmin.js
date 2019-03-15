import React, { Component } from 'react'
import styled from 'react-emotion'
import mq from '../mediaQuery'
import { Route, Link } from 'react-router-dom'
import { ReactComponent as DefaultBackArrow } from '../components/svg/arrowBack.svg'

import ParticipantTableList from '../components/SingleEvent/ParticipantTableList'
import SmartContractFunctions from '../components/SingleEvent/Admin/SmartContractFunctions'
import ErrorBox from '../components/ErrorBox'
import { PARTY_QUERY } from '../graphql/queries'
import { amAdmin } from '../utils/parties'
import SafeQuery from '../components/SafeQuery'
import { GlobalConsumer } from '../GlobalState'
import UpdatePartyMeta from '../components/SingleEvent/Admin/UpdatePartyMeta'

const SingleEventAdminContainer = styled('div')`
  position: relative;
`

const TabContent = styled('div')`
  position: relative;
  left: 0;
  ${mq.medium`
    max-width: calc(100% - 150px);
    left: 150px;
  `}
`

const TabNavigation = styled('div')`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  ${mq.medium`
    justify-content: flex-start;
    position: absolute;
    flex-direction: column;
    left: 0;
    top: 0;
  `}
`

const ToggleLink = styled(Link)`
  display: flex;
  transition: 0.2s;
  color: #aaa;
  padding-right: 20px;

  ${mq.medium`
    margin-bottom: 20px;
  `}

  &:hover {
    color: #6e76ff;
  }

  ${p =>
    p.active &&
    `
    color: #6e76ff;;
  `};
`

const BackToEventButton = styled(Link)`
  border: solid 1px #6e76ff;
  padding: 10px 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  display: flex;
  transition: 0.2s;
  width: 210px;
  justify-content: space-between;
  align-items: center;

  &:hover {
    color: white;
    background: #6e76ff;

    path {
      fill: #ffffff;
    }
  }
`

const BackArrow = styled(DefaultBackArrow)`
  path {
    fill: #6e76ff;
  }
  width: 20px;
  margin-top: 4px;
  margin-left: -4px;
  margin-right: 5px;
`

class SingleEvent extends Component {
  render() {
    const { address } = this.props.match.params
    const {
      location: { pathname }
    } = this.props
    return (
      <GlobalConsumer>
        {({ userAddress }) =>
          !userAddress ? (
            <ErrorBox>You need to be logged-in to view this page</ErrorBox>
          ) : (
            <>
              <BackToEventButton to={`/event/${address}`}>
                <BackArrow /> Back to Event Page
              </BackToEventButton>
              <SafeQuery
                query={PARTY_QUERY}
                variables={{ address }}
                fetchPolicy="cache-and-network"
              >
                {({ data: { party } }) => {
                  const isAdmin = amAdmin(party, userAddress)

                  if (!isAdmin) {
                    return (
                      <ErrorBox>
                        You need to be an admin to view this page
                      </ErrorBox>
                    )
                  }

                  return (
                    <SingleEventAdminContainer>
                      <TabNavigation>
                        <ToggleLink
                          active={pathname === `/event/${address}/admin`}
                          to={`/event/${address}/admin`}
                        >
                          Participants
                        </ToggleLink>
                        <ToggleLink
                          active={pathname === `/event/${address}/admin/edit`}
                          to={`/event/${address}/admin/edit`}
                        >
                          Edit Details
                        </ToggleLink>
                        <ToggleLink
                          active={
                            pathname ===
                            `/event/${address}/admin/smart-contract`
                          }
                          to={`/event/${address}/admin/smart-contract`}
                        >
                          Smart Contract
                        </ToggleLink>
                      </TabNavigation>
                      <TabContent>
                        <Route
                          path={`/event/${address}/admin`}
                          exact
                          render={() => (
                            <ParticipantTableList address={address} />
                          )}
                        />
                        <Route
                          path={`/event/${address}/admin/edit`}
                          exact
                          render={() => <UpdatePartyMeta address={address} />}
                        />
                        <Route
                          path={`/event/${address}/admin/smart-contract`}
                          exact
                          render={() => (
                            <SmartContractFunctions party={party} />
                          )}
                        />
                      </TabContent>
                    </SingleEventAdminContainer>
                  )
                }}
              </SafeQuery>
            </>
          )
        }
      </GlobalConsumer>
    )
  }
}

export default SingleEvent
