'use client';

import Select from '@components/form/select';
import { useCallback, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { STORE_LOCATOR_FULLSCREEN } from '@lib/class-names';
import useMobileVh from '@hooks/useMobileVh';
import Button from '@components/button/button';
import Input from '@components/store-locator-search/input';
import Container from '@components/container/container';
import ArrowForwardIcon from '@assets/material-icons/arrow-forward.svg';
import styles from './store-locator-search.module.scss';

// @TODO: implement google places
const HINTS_TEMP = [
  {
    line1: 'Melbourne1',
    line2: 'VIC, Australia',
  },
  {
    line1: 'Melbourne2',
    line2: 'VIC, Australia',
  },
  {
    line1: 'Melbourne3',
    line2: 'VIC, Australia',
  },
];

const RADIUS_OPTIONS = [
  { value: 10 },
  { value: 25 },
  { value: 50 },
  { value: 100 },
  { value: 500 },
  { value: 1500 },
  { value: 3000 },
];

function stringifyLocation(location) {
  return [location?.line1, location?.line2].join(' ');
}

export default function StoreLocatorSearch() {
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocation] = useState(undefined);
  const [hints, setHints] = useState([]);
  const wrapperOuterRef = useRef(null);
  const formRef = useRef(null);
  useMobileVh();

  const onInputClick = useCallback(ev => {
    setIsFullScreen(true);
  }, []);

  const onAnyInputChange = useCallback(ev => {
    setIsFormValid(formRef.current?.checkValidity());
  }, []);

  const selectLocation = useCallback(location => {
    setLocationInput(stringifyLocation(location));
    setLocation(location);
    setHints([]);
  }, []);

  useEffect(
    function toggleHints() {
      if (locationInput) {
        if (!location || locationInput !== stringifyLocation(location)) {
          setHints(HINTS_TEMP);
        }
      } else {
        setHints([]);
      }
    },
    [locationInput, location],
  );

  useEffect(
    function syncDocumentClass() {
      if (isFullScreen) {
        document.documentElement.classList.add(STORE_LOCATOR_FULLSCREEN);
      } else {
        document.documentElement.classList.remove(STORE_LOCATOR_FULLSCREEN);
      }

      return () => {
        document.documentElement.classList.remove(STORE_LOCATOR_FULLSCREEN);
      };
    },
    [isFullScreen],
  );

  return (
    <section
      className={clsx(styles.wrapper, {
        [styles.isFullScreen]: isFullScreen,
      })}
      ref={wrapperOuterRef}
    >
      <header className={styles.header}>
        <button
          className={clsx(styles.goBack, {
            [styles.isVisible]: isFullScreen,
          })}
          onClick={() => setIsFullScreen(false)}
        >
          <ArrowForwardIcon />
        </button>

        <h3 className={styles.heading}>ILocate a store</h3>
      </header>
      <Container>
        <form
          action="#"
          className={styles.form}
          onChange={onAnyInputChange}
          ref={formRef}
          autoComplete="off"
        >
          <Input
            type="text"
            name="location"
            placeholder="ISearch location"
            icon="search"
            onClick={onInputClick}
            onChange={ev => setLocationInput(ev.target.value)}
            value={locationInput}
            required
          />
          {hints.length > 0 && isFullScreen && (
            <div className={styles.hints}>
              <ul className={styles.hintList}>
                {hints.map((hint, index) => (
                  <li
                    className={styles.hint}
                    key={index}
                    onClick={() => selectLocation(hint)}
                  >
                    {hint.line1 && (
                      <div className={styles.line1}>{hint.line1}</div>
                    )}
                    {hint.line2 && (
                      <div className={styles.line2}>{hint.line2}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <Select
            size="large"
            placeholder="Select radius"
            background="dark"
            suffix="km"
            onClick={() => {
              setIsFullScreen(true);
            }}
            options={RADIUS_OPTIONS}
            selected={RADIUS_OPTIONS[RADIUS_OPTIONS.length - 1].value}
          />
          <Button
            className={styles.button}
            rightIcon="search"
            disabled={!isFormValid}
          >
            ISearch
          </Button>
        </form>
      </Container>
    </section>
  );
}
