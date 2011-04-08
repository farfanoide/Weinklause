<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'weinklause');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'farfa');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'a+ql;0R>I|But*J3s4H_Z+{@zHP5oVXcc3>j?[A0;rx-U+K1yF`Pdmu/B&ge1Q8K');
define('SECURE_AUTH_KEY',  'cC8T3Lh=z.VlPHNRhm_jJOQCn1vWb(5FKzi~;5ytcmQ2[TwUFH@qJgjdv%cJj<Q@');
define('LOGGED_IN_KEY',    'hBKh7> JuG@vrY#`j7_xqhAC?rdB/vM206}NR1&ZVsKbvO{S??Kfc[~-b&Oo@fpq');
define('NONCE_KEY',        'II6PvR|p?rc6<T9cMGO=AzbOP^Q_~l&E0K(8)je;/G7^eKU_7N,O#/!V8b,Wfm1y');
define('AUTH_SALT',        '1zVqkSwF-:7vhm*A6V3@E<ze:7Rwvvo@g}6f|?]Qx|1IWx72IaO.tBB.x~KI:?@2');
define('SECURE_AUTH_SALT', '/yAV+duT*TtsHV5|.Vab/w.0fCKDQZ;I@P<j#m P(}L;l]y$jj<vs8)</Ssh$^Hf');
define('LOGGED_IN_SALT',   'b-Fz3DQ!.7^}h2>x?|]Yzz4BSR<)|SENxvfa|}-Rpid.W]rpcs(Be_V!rKC5t)7g');
define('NONCE_SALT',       '/`y!wpM4!6yy7mcXP57`sp!-MM(9Tiu){^*iyU?T?Y,Gy3fOzZH;:Mw#s#X^>wl4');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'de_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress.  A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de.mo to wp-content/languages and set WPLANG to 'de' to enable German
 * language support.
 */
define ('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');

