'use client';

import { useState } from 'react';

import Image from 'next/image';

import Button from '@components/button/button';

import DateIcon from '@assets/icons/date-icon.svg';
import GiftCardDesign1 from '@assets/images/design-1.png';
import GiftCardDesign2 from '@assets/images/design-2.png';

import styles from './gift-card.module.scss';

export default function EGiftCard() {
  const [amount, setAmount] = useState(200);
  const [quantity, setQuantity] = useState(1);
  const [customValue, setCustomValue] = useState('');
  const [sendTime, setSendTime] = useState('sendNow');
  const [sendDate, setSendDate] = useState('');

  const [selectedDesign, setSelectedDesign] = useState('design1');

  const handleQtyMinus = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQtyPlus = () => {
    setQuantity(prev => prev + 1);
  };

  return (
    <div className={styles.eGiftCardMain}>
      <div className={styles.leftPart}>
        <h2>
          HSP Vehicle Accessories <span>eGift Cards</span>
        </h2>
        <div className={styles.cardImgContent}>
          <Image
            alt="Gift Card Image"
            height={516}
            src={
              selectedDesign === 'design1' ? GiftCardDesign1 : GiftCardDesign2
            }
            width={516}
          />
        </div>
      </div>

      <div className={styles.rightPart}>
        <h2>
          HSP Vehicle Accessories <span>eGift Cards</span>
        </h2>

        <div className={styles.formBlock}>
          <div className={styles.chooseValue}>
            <label className={styles.inputLabel}>
              Choose a Value & Quantity
            </label>
            <div className={styles.selectOptions}>
              <label htmlFor="gift50">
                <input
                  checked={amount === 50}
                  id="gift50"
                  name="giftCardValue"
                  onChange={e => {
                    setAmount(Number(e.target.value));
                    setCustomValue('');
                  }}
                  type="radio"
                  value="50"
                />
                <div className={styles.option}>$50</div>
              </label>

              <label htmlFor="gift100">
                <input
                  checked={amount === 100}
                  id="gift100"
                  name="giftCardValue"
                  onChange={e => {
                    setAmount(Number(e.target.value));
                    setCustomValue('');
                  }}
                  type="radio"
                  value="100"
                />
                <div className={styles.option}>$100</div>
              </label>

              <label htmlFor="gift200">
                <input
                  checked={amount === 200}
                  id="gift200"
                  name="giftCardValue"
                  onChange={e => {
                    setAmount(Number(e.target.value));
                    setCustomValue('');
                  }}
                  type="radio"
                  value="200"
                />
                <div className={styles.option}>$200</div>
              </label>

              <label htmlFor="gift500">
                <input
                  checked={amount === 500}
                  id="gift500"
                  name="giftCardValue"
                  onChange={e => {
                    setAmount(Number(e.target.value));
                    setCustomValue('');
                  }}
                  type="radio"
                  value="500"
                />
                <div className={styles.option}>$500</div>
              </label>

              <label htmlFor="gift1000">
                <input
                  checked={amount === 1000}
                  id="gift1000"
                  name="giftCardValue"
                  onChange={e => {
                    setAmount(Number(e.target.value));
                    setCustomValue('');
                  }}
                  type="radio"
                  value="1000"
                />
                <div className={styles.option}>$1000</div>
              </label>
            </div>
          </div>

          <div className={styles.inputBlock}>
            <div className={styles.custAndQty}>
              <div className={styles.custinput}>
                <label className={styles.inputLabel}>
                  Custom Value (Up to $1000)
                </label>
                <input
                  className={styles.customValueinput}
                  onChange={e => {
                    const val = Number(e.target.value);
                    if (val <= 1000) {
                      setCustomValue(e.target.value);
                      setAmount(val);
                    }
                  }}
                  type="number"
                  value={customValue}
                />
              </div>

              <div className={styles.qtyinput}>
                <div className={styles.qtyBlock}>
                  <button
                    className={styles.minus}
                    disabled={quantity <= 1}
                    onClick={handleQtyMinus}
                    type="button"
                  >
                    _
                  </button>

                  <input readOnly type="number" value={quantity} />

                  <button
                    className={styles.plus}
                    onClick={handleQtyPlus}
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.chooseDesign}>
            <label className={styles.inputLabel}>Choose a Design</label>
            <div className={styles.selectDesign}>
              <label className={styles.option} htmlFor="design1">
                <input
                  checked={selectedDesign === 'design1'}
                  id="design1"
                  name="giftCardDesign"
                  onChange={e => setSelectedDesign(e.target.value)}
                  type="radio"
                  value="design1"
                />
                <div className={styles.designOption}>
                  <Image
                    alt="Gift Card Image"
                    height={81}
                    src={GiftCardDesign1}
                    width={143}
                  />
                </div>
              </label>

              <label className={styles.option} htmlFor="design2">
                <input
                  checked={selectedDesign === 'design2'}
                  id="design2"
                  name="giftCardDesign"
                  onChange={e => setSelectedDesign(e.target.value)}
                  type="radio"
                  value="design2"
                />
                <div className={styles.designOption}>
                  <Image
                    alt="Gift Card Image"
                    height={81}
                    src={GiftCardDesign2}
                    width={143}
                  />
                </div>
              </label>
            </div>
          </div>

          <div className={styles.rsForm}>
            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Recipient&apos;s Name
                </label>
                <input type="text" />
              </div>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>Sender&apos;s Name</label>
                <input type="text" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Recipient&apos;s Email Address
                </label>
                <input type="email" />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Personalised Message
                </label>
                <input type="text" />
              </div>
            </div>
          </div>

          <div className={styles.sendTime}>
            <label className={styles.inputLabel}>Send Time</label>
            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <div className={styles.timeOptions}>
                  <label htmlFor="sendNow">
                    <input
                      checked={sendTime === 'sendNow'}
                      id="sendNow"
                      name="sendTime"
                      onChange={e => setSendTime(e.target.value)}
                      type="radio"
                      value="sendNow"
                    />
                    <div className={styles.tOpt}>SEND NOW</div>
                  </label>

                  <label htmlFor="sendLater">
                    <input
                      checked={sendTime === 'sendLater'}
                      id="sendLater"
                      name="sendTime"
                      onChange={e => setSendTime(e.target.value)}
                      type="radio"
                      value="sendLater"
                    />
                    <div className={styles.tOpt}>SEND LATER</div>
                  </label>
                </div>
              </div>
            </div>

            {sendTime === 'sendLater' && (
              <div className={styles.formRow}>
                <div className={styles.inputBlock}>
                  <label className={styles.inputLabel}>Pick a date</label>
                  <div className={styles.dateInput}>
                    <input
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setSendDate(e.target.value)}
                      type="date"
                      value={sendDate}
                    />
                    <div className={styles.dateIcon}>
                      <DateIcon />
                    </div>
                  </div>
                  <div className={styles.dateNote}>
                    eGift Card will be sent at 7am on the nominated day
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.totalPayments}>
            <div className={styles.amount}>
              Total<span>${amount * quantity}</span>
            </div>
            <Button
              className={styles.checkoutBtn}
              disabled={sendTime === 'sendLater' && !sendDate}
              variant="primary"
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
