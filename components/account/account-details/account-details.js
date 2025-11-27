'use client';

import Image from 'next/image';

import GoldIcon from '@assets/images/gold-icon.png';
import Logo2 from '@assets/images/load-bar.png';
import Logo1 from '@assets/images/rollcover.png';
import SilverIcon from '@assets/images/silver-icon.png';
import Logo3 from '@assets/images/tall-assist.png';

import styles from './account-details.module.scss';

function AccountDetails() {
  return (
    <div className={styles.accountDetails}>
      <h2 className={styles.sectionTitle}>Canopies WA</h2>

      <div className={styles.customBtns}>
        <a className={styles.goldButton} href="#">
          <Image alt={'HSP Logo'} height={50} src={GoldIcon} width={50} />
          Grand Master Store
        </a>
        <a className={styles.silverButton} href="#">
          <Image alt={'HSP Logo'} height={38} src={SilverIcon} width={38} />
          Access Platinum Price List Here
        </a>
      </div>

      <div className={styles.borderBox}>
        <div className={styles.tableInfo}>
          <h5>Business Details</h5>
          <div className={styles.tableWrapper}>
            <table>
              <tbody>
                <tr>
                  <td>Business Address:</td>
                  <td>Unit 2/1956 Beach Rd, Malaga WA 6090</td>
                </tr>
                <tr>
                  <td>Communications Email:</td>
                  <td>
                    <a href="mailto:info@canopieswa.com.au">
                      info@canopieswa.com.au
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Accounts Email:</td>
                  <td>
                    <a href="mailto:accounts@canopieswa.com.au">
                      accounts@canopieswa.com.au
                    </a>
                  </td>
                </tr>
                <tr>
                  <td>Phone Number:</td>
                  <td>
                    <a href="tel:+1300498432">1300 498 432</a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.tableInfo}>
          <h5>Account Terms</h5>
          <div className={styles.tableWrapper}>
            <table>
              <tbody>
                <tr>
                  <td>Credit Limit:</td>
                  <td>$100,000</td>
                </tr>
                <tr>
                  <td>Payment Terms:</td>
                  <td>45 Days</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.currentStatus}>
          <div className={styles.title}>HSP Reseller Since</div>
          <div className={styles.date}>21st July, 2025</div>
        </div>
      </div>

      <div className={styles.borderBox}>
        <div className={styles.logosList}>
          <h4>In-Store Displays</h4>
          <ul>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={44} src={Logo1} width={187} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={38} src={Logo2} width={127} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={38} src={Logo2} width={127} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={40} src={Logo3} width={128} />
              </figure>
            </li>
            <li>
              <figure>
                <Image alt={'HSP Logo'} height={40} src={Logo3} width={128} />
              </figure>
            </li>
          </ul>
          <div className={styles.btns}>
            <button className={styles.button} type="button">
              Request Display Pricing
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomText}>
        <p>
          To Edit Any Business Information, Please <a href="#">Contact Us</a>
        </p>
      </div>
    </div>
  );
}

export default AccountDetails;
