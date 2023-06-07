import React, { useRef, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

type SignupProps = {
  onClose: () => void;
};

function Signup({ onClose }: SignupProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const modalRef = useRef(null);

  const addUsers = async () => {
    try {
      const response = await axios.post<string>('http://3.34.102.60:8080/api/users/signup', {
        email,
        password,
        nickname,
      });
      alert('회원가입 성공');
      onClose();
      return response;
    } catch (error) {
      console.error('회원가입 API 에러 : ', error);
      alert(error);
      throw error;
    }
  };

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError('');
  };

  const onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError('');
  };

  const onNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setNicknameError('');
  };

  const onBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current === e.target) {
      onClose();
    }
  };

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nicknameRegex = /^[가-힣a-zA-Z]{2,10}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

    // 이메일 유효성 검사
    if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    // 닉네임 유효성 검사
    if (!nicknameRegex.test(nickname)) {
      setNicknameError('유효한 닉네임을 입력해주세요.');
      return;
    }

    // 비밀번호 유효성 검사
    if (!passwordRegex.test(password)) {
      setPasswordError(
        '유효한 비밀번호를 입력해주세요.\n비밀번호는 최소 6자리 이상이어야 하며, 영문과 숫자가 포함되어야 합니다.'
      );
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다.');
      return;
    }
    addUsers();
  };

  const onEmailCheck = async () => {
    try {
      const response = await axios.get(
        `http://3.34.102.60:8080/api/users/email-check?email=${email}`
      );
      console.log(email);
      console.log('중복된 아이디가 없다');
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log('아이디가 중복됬습니다');
      }
    }
  };

  return (
    <StModalWrapper ref={modalRef} onClick={onBackgroundClick}>
      <StModalContent>
        <StTitleComment>이메일로 가입하기</StTitleComment>
        <label htmlFor="email">이메일</label>
        <StInputSection>
          <StInput type="email" id="email" value={email} onChange={onEmailChange} />
          <StButton onClick={onEmailCheck}>중복검사</StButton>
          <div>{emailError && <StErrorMessage>{emailError}</StErrorMessage>}</div>
        </StInputSection>

        <label htmlFor="password">비밀번호</label>
        <StInputSection>
          <StInput type="password" id="password" value={password} onChange={onPasswordChange} />
          <div>{passwordError && <StErrorMessage>{passwordError}</StErrorMessage>}</div>
        </StInputSection>

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <StInputSection>
          <StInput
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
          />
          <div>
            {confirmPasswordError && <StErrorMessage>{confirmPasswordError}</StErrorMessage>}
          </div>
        </StInputSection>

        <label htmlFor="nickname">닉네임</label>
        <StInputSection>
          <StInput type="text" id="nickname" value={nickname} onChange={onNicknameChange} />
          <div>{nicknameError && <StErrorMessage>{nicknameError}</StErrorMessage>}</div>
        </StInputSection>

        <StSubmitButton onClick={onSubmit}>가입하기</StSubmitButton>
      </StModalContent>
    </StModalWrapper>
  );
}

export default Signup;

const buttonStyle = `
padding: 8px 16px;
background-color: #3d3d3d;
color: white;
border: none;
border-radius: 4px;
cursor: pointer;

&:hover {
  background-color: #bcbcbc;
}
`;

const StModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const StModalContent = styled.div`
  background-color: white;
  padding: 100px;
  border-radius: 4px;
  margin-top: 100px;
  height: 100%;
  width: 800px;
  align-items: center;
`;

const StInputSection = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const StTitleComment = styled.h2`
  margin-bottom: 80px;
`;

const StErrorMessage = styled.label`
  color: red;
`;

const StInput = styled.input`
  flex: 1;
  padding: 8px;
  margin-right: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 40px;
  margin-top: 10px;
`;

const StButton = styled.button`
  ${buttonStyle}
`;

const StSubmitButton = styled.button`
  ${buttonStyle}
  width: 150px;
  margin-top: 50px;
`;
