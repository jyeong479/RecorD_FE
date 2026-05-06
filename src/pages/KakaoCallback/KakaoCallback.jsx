/*
 * KakaoCallback.jsx
 * 카카오 로그인 콜백 처리 페이지
 * 로그인 성공 시 홈으로 리다이렉트, 실패 시 로그인 페이지로 리다이렉트
 * 백엔드 API 주소는 추후 팀 서버에 맞게 수정
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    const redirect_uri = process.env.REACT_APP_KAKAO_REDIRECT_URI;

    if (code) {
      // 백엔드 요청: GET -> POST 방식으로 변경, body에 code와 redirect_uri 담기
      axios.post('http://localhost:8080/api/auth/kakao/', {
        code: code,
        redirect_uri: redirect_uri
      })
        .then((res) => {
          console.log('로그인 성공:', res.data);
          localStorage.setItem('token', res.data.token); // 실제 토큰 저장
          navigate('/');
        })
        .catch((err) => {
          console.error('백엔드 연동 에러 (정상):', err);
          
          // --- 프론트엔드 테스트용 강제 로그인 처리 로직 ---
          // 백엔드가 개발/배포 완료되면 아래 3줄은 지우고 navigate('/login'); 로 원복하세요.
          alert('백엔드 미배포 상태입니다. 흐름 테스트를 위해 임시로 메인 페이지로 이동합니다.');
          localStorage.setItem('token', 'temporary-test-token');
          navigate('/');
          // ------------------------------------------------
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-[#FEE500] rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-medium text-gray-600">카카오 로그인 처리 중입니다...</p>
    </div>
  );
};

export default KakaoCallback;