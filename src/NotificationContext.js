import React, { useCallback, useEffect, useMemo, useState } from "react";
import Toast from "react-bootstrap/Toast";
import { FaHeartBroken } from "react-icons/fa";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { fr } from "date-fns/locale";

export const NotificationContext = React.createContext({
  pushError: () => {},
});

export function NotificationProvider({ children }) {
  const [errors, setErrors] = useState([]);
  const [updateTick, setUpdateTick] = useState();
  useEffect(() => {
    if (errors.length) {
      const intervalID = window.setInterval(() => setUpdateTick({}), 5000);
      return () => window.clearInterval(intervalID);
    }
  }, [errors]);

  const pushError = useCallback(
    (error) =>
      setErrors((errors) =>
        errors.concat([
          {
            creationDate: new Date(),
            message:
              typeof error === "string"
                ? error
                : [error.name, error.message].join(": "),
          },
        ])
      ),
    []
  );

  const NotificationContextValue = useMemo(() => ({ pushError }), [pushError]);
  return (
    <NotificationContext.Provider value={NotificationContextValue}>
      <NotificationViewer
        notifications={errors}
        onClose={(notification) =>
          setErrors((errors) => errors.filter((err) => err !== notification))
        }
        updateTick={updateTick}
      />

      {children}
    </NotificationContext.Provider>
  );
}
function NotificationViewer({ notifications = [], onClose = () => {} }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="fixed-bottom">
      <div
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          minWidth: 275,
        }}
      >
        {notifications.map((notification) => (
          <ErrorToast
            {...notification}
            onClose={() => onClose(notification)}
            key={notification.creationDate}
          />
        ))}
      </div>
    </div>
  );
}
function ErrorToast({ message, creationDate, onClose }) {
  return (
    <Toast onClose={onClose}>
      <Toast.Header>
        <strong className="me-auto text-danger">
          <FaHeartBroken className="me-1" />
          Erreur
        </strong>
        <small>
          {formatDistanceToNow(creationDate, {
            includeSeconds: true,
            locale: fr,
          })}
        </small>
      </Toast.Header>
      <Toast.Body className="bg-danger text-white">{message}</Toast.Body>
    </Toast>
  );
}
