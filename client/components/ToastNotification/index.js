import { CloseButton, ToastIconContainer, ToastContainer } from './styles';

import CloseButtonSvg from '../../assets/close_button.svg';
import ErrorMessage from '../../assets/error_message.svg';
import WarningMessage from '../../assets/warning_message.svg';
import SuccessMessage from '../../assets/success_message.svg';

const ToastNotification = ({ appearance, children, onDismiss }) => {
  const getToastIcon = () => {
    switch (appearance) {
      case 'error':
        return ErrorMessage;
      case 'warning':
        return WarningMessage;
      case 'success':
        return SuccessMessage;
      default:
        return ErrorMessage;
    }
  };

  const ToastIcon = getToastIcon();
  return (
    <ToastContainer appearance={appearance}>
      <ToastIconContainer>
        <ToastIcon />
      </ToastIconContainer>
      {children}
      <CloseButton onClick={onDismiss}>
        <CloseButtonSvg></CloseButtonSvg>
      </CloseButton>
    </ToastContainer>
  );
};

export default ToastNotification;
