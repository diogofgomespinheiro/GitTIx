import axios from 'axios';
import { useToasts } from 'react-toast-notifications';

const useRequest = ({ url, method, onSuccess }) => {
  const { addToast } = useToasts();

  const doRequest = async body => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const {
        data: { errors },
      } = err.response;

      if (errors && errors.length) {
        errors.forEach(error =>
          addToast(error.message, {
            appearance: 'error',
            autoDismiss: true,
          }),
        );
      }
    }
  };

  return { doRequest };
};

export default useRequest;
