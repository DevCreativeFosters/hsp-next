'use client';

import { useState } from 'react';

import Image from 'next/image';

import { useCart } from '@contexts/cart-context';

import { fetchAPI } from '@lib/fetch-api';

import Button from '@components/button/button';
import Loading from '@components/loading/loading';

import DateIcon from '@assets/icons/date-icon.svg';

import styles from './gift-card.module.scss';

export default function EGiftCard({ firstMatchedProduct, heading, product }) {
  const [loading, setLoading] = useState(false);

  const { getCartItems, openCart } = useCart();
  const [amount, setAmount] = useState(200);
  const [quantity, setQuantity] = useState(1);
  const [customValue, setCustomValue] = useState('');
  const [sendTime, setSendTime] = useState('now');
  const [sendDate, setSendDate] = useState('');

  const [selectedDesign, setSelectedDesign] = useState(
    product?.cardDesigns?.nodes?.[0]?.id,
  );

  const selectedDesignImage = product?.cardDesigns?.nodes?.find(
    design => design.id === selectedDesign,
  )?.sourceUrl;

  const [giftDetails, setGiftDetails] = useState({
    message: '',
    recipientEmail: '',
    recipientName: '',
    senderName: '',
  });

  const handleGiftChange = e => {
    const { name, value } = e.target;
    setGiftDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQtyMinus = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQtyPlus = () => {
    setQuantity(prev => prev + 1);
  };

  const handleAddToCart = async () => {
    setLoading(true);

    const query = `
      mutation AddGiftCard($input: AddGiftCardToCartInput!) {
        addGiftCardToCart(input: $input) {
          cartItemKey1
          success
          message
        }
      }
    `;

    try {
      const data = await fetchAPI(query, {
        variables: {
          input: {
            amount: amount,
            customAmount: Number(customValue),
            designImage: selectedDesignImage,
            productId: firstMatchedProduct?.databaseId,
            quantity: quantity,
            ...giftDetails,
            sendDate: sendDate,
            sendType: sendTime,
          },
        },
      });

      await getCartItems();

      openCart();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.eGiftCardMain}>
      <div className={styles.leftPart}>
        <div className={styles.cardImgContent}>
          <Image
            alt="Gift Card Image"
            height={516}
            src={selectedDesignImage}
            width={516}
          />
        </div>
      </div>

      <div className={styles.rightPart}>
        {heading}

        <div className={styles.formBlock}>
          <div className={styles.chooseValue}>
            <label className={styles.inputLabel}>
              Choose a Value & Quantity
            </label>
            <div className={styles.selectOptions}>
              {product?.giftCardAmounts?.map(({ amount: cardAmount }) => (
                <label key={`gift-${cardAmount}`}>
                  <input
                    checked={amount === cardAmount}
                    id={`gift${cardAmount}`}
                    name="giftCardValue"
                    onChange={e => {
                      setAmount(Number(e.target.value));
                      setCustomValue('');
                    }}
                    type="radio"
                    value={cardAmount}
                  />
                  <div className={styles.option}>${cardAmount}</div>
                </label>
              ))}
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
              {product?.cardDesigns?.nodes?.map(cardDesign => (
                <label
                  className={styles.option}
                  htmlFor={cardDesign?.id}
                  key={cardDesign?.id}
                >
                  <input
                    checked={selectedDesign === cardDesign?.id}
                    id={cardDesign?.id}
                    name="giftCardDesign"
                    onChange={e => setSelectedDesign(e.target.value)}
                    type="radio"
                    value={cardDesign?.id}
                  />
                  <div className={styles.designOption}>
                    <Image
                      alt="Gift Card Image"
                      height={81}
                      src={cardDesign?.sourceUrl}
                      width={143}
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.rsForm}>
            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Recipient&apos;s Name
                </label>
                <input
                  name="recipientName"
                  onChange={handleGiftChange}
                  type="text"
                  value={giftDetails.recipientName}
                />
              </div>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>Sender&apos;s Name</label>
                <input
                  name="senderName"
                  onChange={handleGiftChange}
                  type="text"
                  value={giftDetails.senderName}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Recipient&apos;s Email Address
                </label>
                <input
                  name="recipientEmail"
                  onChange={handleGiftChange}
                  type="email"
                  value={giftDetails.recipientEmail}
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <label className={styles.inputLabel}>
                  Personalised Message
                </label>
                <input
                  name="message"
                  onChange={handleGiftChange}
                  type="text"
                  value={giftDetails.message}
                />
              </div>
            </div>
          </div>

          <div className={styles.sendTime}>
            <label className={styles.inputLabel}>Send Time</label>
            <div className={styles.formRow}>
              <div className={styles.inputBlock}>
                <div className={styles.timeOptions}>
                  <label htmlFor="now">
                    <input
                      checked={sendTime === 'now'}
                      id="now"
                      name="sendTime"
                      onChange={e => setSendTime(e.target.value)}
                      type="radio"
                      value="now"
                    />
                    <div className={styles.tOpt}>SEND NOW</div>
                  </label>

                  <label htmlFor="later">
                    <input
                      checked={sendTime === 'later'}
                      id="later"
                      name="sendTime"
                      onChange={e => setSendTime(e.target.value)}
                      type="radio"
                      value="later"
                    />
                    <div className={styles.tOpt}>SEND LATER</div>
                  </label>
                </div>
              </div>
            </div>

            {sendTime === 'later' && (
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
              disabled={(sendTime === 'later' && !sendDate) || loading}
              onClick={handleAddToCart}
              variant="primary"
            >
              Add to Cart
              {loading && <Loading />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
