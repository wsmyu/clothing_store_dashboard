import React from 'react';
import { ConfirmDialog } from 'primereact/confirmdialog';

const ConfirmationDialog = ({ visible, onHide, message, header, icon, acceptClassName, accept, reject }) => (
  <ConfirmDialog
    visible={visible}
    onHide={onHide}
    message={message}
    header={header}
    icon={icon}
    acceptClassName={acceptClassName}
    accept={accept}
    reject={reject}
  />
);

export default ConfirmationDialog;
