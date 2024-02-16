import useGravityForm from '@hooks/useGravityForm';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AttachmentIcon from '@assets/icons/attachment.svg';
import DeleteIcon from '@assets/icons/delete.svg';
import styles from './file-upload-field.module.scss';

const MEGA_BYTE = Math.pow(1024, 2);

export default function FileUploadField({ form, field, fieldErrors }) {
  const { formId } = form;
  const [files, setFiles] = useState([]);
  const inputRef = useRef();
  const { dispatch } = useGravityForm();
  const multiple = field.canAcceptMultipleFiles || null;
  const maxFiles = field.maxFiles;
  const maxSize = (field.maxFileSize || 0) * MEGA_BYTE;

  const tooBigFileErrorMessage = `Maximum allowed file size is ${field.maxFileSize} MB`;
  const tooManyFilesErrorMessage = `You can upload only ${maxFiles} file${
    maxFiles > 1 ? 's' : ''
  }.`;

  const fieldError = useMemo(() => {
    const backendError = fieldErrors.find(
      fieldError => fieldError.id === field.id,
    );

    const hasTooBigFile =
      maxSize && files.find(({ fileHandle: { size } }) => size > maxSize);

    const hasTooManyFiles = maxFiles > 0 && files.length > maxFiles;

    if (backendError || hasTooManyFiles) {
      return {
        id: field.id,
        message: [
          backendError?.message,
          hasTooManyFiles ? tooManyFilesErrorMessage : null,
          hasTooBigFile ? tooBigFileErrorMessage : null,
        ]
          .filter(Boolean)
          .join(' '),
      };
    }
    return null;
  }, [
    maxFiles,
    maxSize,
    files,
    fieldErrors,
    field,
    tooManyFilesErrorMessage,
    tooBigFileErrorMessage,
  ]);

  const acceptedTypesNormalized = useMemo(() => {
    return (
      field.allowedExtensions?.map(ext => {
        const startsWithDot = ext.slice(0, 1) === '.';
        if (!startsWithDot && (ext?.length === 3 || ext?.length === 4)) {
          return `.${ext}`;
        }
        return ext;
      }) || []
    );
  }, [field.allowedExtensions]);

  const acceptedTypesPrinted = acceptedTypesNormalized
    .map(ext => (ext.slice(0, 1) === '.' ? ext.slice(1) : ext))
    .join(', ');

  const maxFilesPrinted =
    maxFiles > 0 ? `max. ${maxFiles} file${maxFiles > 1 ? 's' : ''}` : '';

  const getValidationErrors = useCallback(
    file => {
      const errors = [];
      if (maxSize && file.size > maxSize) {
        errors.push('File is too big');
      }
      if (acceptedTypesNormalized.length) {
        const matchedType = acceptedTypesNormalized.find(
          ext => ext === file.name.slice(-1 * ext.length),
        );
        if (!matchedType) {
          errors.push('File type is not allowed');
        }
      }
      return errors;
    },
    [maxSize, acceptedTypesNormalized],
  );

  const addFiles = useCallback(
    inputElement => {
      const freshFiles = Array.from(inputElement.files).map(file => {
        return {
          fileHandle: file,
          errors: getValidationErrors(file),
        };
      });
      setFiles(oldFiles => [...oldFiles, ...freshFiles]);
    },
    [getValidationErrors],
  );

  const onRemoveFileClick = useCallback(
    (ev, file) => {
      ev.stopPropagation();
      ev.preventDefault();

      const filteredFiles = files.filter(
        ({ fileHandle: { name, size } }) =>
          name !== file.name && size !== file.size,
      );

      setFiles(filteredFiles);
    },
    [files],
  );

  useEffect(
    function syncFiles() {
      const dt = new DataTransfer();
      files.forEach(({ fileHandle: file, errors }) => {
        if (errors.length === 0) {
          dt.items.add(file);
        }
      });
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
          data-max-file-size={field.maxFileSize || null}
          onChange={ev => {
            addFiles(ev.nativeEvent.target);
            dispatch({
              type: 'updateFieldValue',
              payload: {
                id: field.id,
                fileUploadValues: inputRef.current.files,
              },
            });
          }}
        />
        <div
          className={clsx(styles.customInput, {
            [styles.error]: fieldError?.message,
          })}
        >
          {files.map(({ fileHandle: file, errors }, index) => (
            <div
              key={`${file.name}-${index}`}
              className={clsx(styles.fileNameWrapper, {
                [styles.isInvalid]: errors.length,
              })}
              title={errors.length ? errors.join('. ') : file.name}
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
            <span>{field.label}</span>
            {(acceptedTypesPrinted || maxFiles > 0) && (
              <span className={styles.types}>
                (
                {[acceptedTypesPrinted, maxFilesPrinted]
                  .filter(Boolean)
                  .join(', ')}
                )
              </span>
            )}
          </div>
        </div>

        {fieldError?.message && (
          <div className={styles.errorMessage}>{fieldError?.message}</div>
        )}
      </label>
    </>
  );
}
