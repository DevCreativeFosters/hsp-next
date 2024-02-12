import { useCallback, useRef, useState } from 'react';
import AttachmentIcon from '@assets/icons/attachment.svg';
import DeleteIcon from '@assets/icons/delete.svg';
import styles from './file-upload-field.module.scss';

const MEGA_BYTE = 1024 * 1024;

export default function FileUploadField({ form, field, fieldErrors }) {
  const { formId } = form;
  const [files, setFiles] = useState([]);
  const inputRef = useRef();

  const acceptedTypesNormalized = field.allowedExtensions?.map(ext => {
    const startsWithDot = ext.slice(0, 1) === '.';
    if (!startsWithDot && (ext?.length === 3 || ext?.length === 4)) {
      return `.${ext}`;
    }
    return ext;
  });

  const acceptedTypesPrinted = acceptedTypesNormalized
    .map(ext => (ext.slice(0, 1) === '.' ? ext.slice(1) : ext))
    .join(', ');
  const multiple = field.maxFiles > 1 || null;
  const fileSize = field.maxFileSize ? field.maxFileSize * MEGA_BYTE : null;

  const validFileType = function () {
    return true;
  };

  const updateFileListing = useCallback(inputElement => {
    const fileList = Array.from(inputElement.files).map(file => {
      return validFileType(file)
        ? file
        : {
            ...file,
            invalid: true,
          };
    });
    setFiles(fileList);
  }, []);

  const onRemoveFileClick = useCallback(
    (ev, file) => {
      ev.stopPropagation();
      ev.preventDefault();

      const updatedFiles = files.filter(
        ({ name, size }) => name !== file.name && size !== file.size,
      );

      const dt = new DataTransfer();
      updatedFiles.forEach(file => {
        dt.items.add(file);
      });
      setFiles(updatedFiles);
      if (dt.files.length) {
        inputRef.current.files = dt.files;
      } else {
        inputRef.current.value = '';
      }
    },
    [files],
  );

  return (
    <>
      <label className={styles.labelWrapper}>
        <input
          ref={inputRef}
          type="file"
          className={styles.nativeInput}
          id={`gform_${formId}_${field.id}`}
          name={`gform_${formId}_${field.id}`}
          accept={acceptedTypesNormalized.join() || null}
          multiple={multiple}
          size={fileSize}
          onChange={ev => {
            updateFileListing(ev.nativeEvent.target);
          }}
        />
        <div className={styles.customInput}>
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className={styles.fileNameWrapper}
              title={file.name}
            >
              <span className={styles.fileName}>{file.name}</span>
              <button
                type="button"
                className={styles.removeButton}
                title="Click to remove"
                onClick={ev => onRemoveFileClick(ev, file)}
              >
                <DeleteIcon />
              </button>
            </div>
          ))}

          <div className={styles.cta}>
            <div className={styles.icon}>
              <AttachmentIcon />
            </div>
            <span>Attach file{multiple ? 's' : ''}</span>
            <span className={styles.types}>({acceptedTypesPrinted})</span>
          </div>
        </div>
      </label>
    </>
  );
}
