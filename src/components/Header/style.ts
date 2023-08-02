import styled from "styled-components";

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 20px 40px;
  border-bottom: 1px solid #e4e5e5;
`;

export const SearchContainer = styled.div`
  width: 290px;
`;

export const AccountContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ReminderContainer = styled.div<{ reminderExists?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: #fafafa;
  width: 48px;
  height: 48px;
  margin-right: 40px;
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    display: ${(props) => (props.reminderExists ? "block" : "none")};
    position: absolute;
    width: 8px;
    height: 8px;
    background: #c9262c;
    border-radius: 50%;
    right: 15px;
    top: 10px;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const Avatar = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  margin-right: 14px;
`;

export const UserDescription = styled.div`
  margin-right: 20px;
`;

export const UserName = styled.h3`
  color: #1d1e22;
  text-align: center;
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%;
  margin: 0;
  text-align: left;
`;

export const UserRole = styled.h4`
  color: #636467;
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%;
  margin: 0;
  text-align: left;
`;
