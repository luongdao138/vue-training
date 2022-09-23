import { ref, isRef, watchEffect, unref, nextTick } from "vue";
import axios from "axios";
import client from "@/services/client";

export function useQuery(url, params = {}, options = {}) {
  const {
    requiredAuth = true,
    enabled = true,
    onSuccess = () => {},
    onError = () => {},
  } = options;

  const data = ref(null);
  const isLoading = ref(false);
  const status = ref("idle");
  const isSuccess = ref(false);
  const isError = ref(false);
  const error = ref(null);

  const handleFetch = () => {
    if (!unref(enabled)) {
      return;
    }

    console.log({ params: unref(params) });

    console.log("Call API: ", unref(url));

    isLoading.value = true;
    status.value = "pending";

    let axiosInstance = unref(requiredAuth) ? client : axios;

    axiosInstance
      .get(unref(url), { params: unref(params) })
      .then((res) => {
        data.value = res.data;
        isSuccess.value = true;
        isError.value = false;
        error.value = null;
        status.value = "success";
        nextTick(() => {
          onSuccess();
        });
      })
      .catch((error) => {
        data.value = null;
        error.value = error;
        isError.value = true;
        isSuccess.value = false;
        status.value = "error";
        nextTick(() => {
          onError();
        });
      })
      .finally(() => {
        isLoading.value = false;
      });
  };

  if (isRef(url) || isRef(enabled) || isRef(requiredAuth)) {
    watchEffect(handleFetch);
  } else {
    handleFetch();
  }

  return {
    data,
    isError,
    isSuccess,
    isLoading,
    error,
    status,
  };
}
