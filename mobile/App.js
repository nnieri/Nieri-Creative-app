import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import * as WebBrowser from "expo-web-browser";
import {
  BadgeCheck,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Copy,
  ExternalLink,
  Home,
  Images,
  Link2,
  Loader2,
  MapPin,
  PlayCircle,
  Sparkles,
  WandSparkles,
} from "lucide-react-native";
import { ARYEO_ORDER_FORM_URL } from "./src/config";
import { api } from "./src/services/api";
import { colors, shadows, typography } from "./src/styles/theme";

const nieriLogo = require("./assets/brand/nieri-logo-black.png");

const tabs = [
  { key: "home", label: "Home", icon: Home },
  { key: "book", label: "Book", icon: CalendarPlus },
  { key: "media", label: "Media", icon: Images },
  { key: "ai", label: "AI Tools", icon: Sparkles },
];

const checklistItems = [
  "Turn on all lights",
  "Open blinds",
  "Hide trash cans",
  "Clear kitchen counters",
  "Remove cars from driveway",
  "Put away pet items",
  "Clean mirrors/windows",
  "Stage outdoor spaces",
  "Make beds",
  "Hide personal documents/photos if needed",
];

const howToVideos = [
  {
    title: "Prepare for listing photos",
    category: "Shoot prep",
    thumbnail: "https://picsum.photos/seed/nieri-video-prep/800/450",
    url: "https://example.com/videos/listing-photo-prep",
  },
  {
    title: "Record a better real estate Reel",
    category: "Social video",
    thumbnail: "https://picsum.photos/seed/nieri-video-reel/800/450",
    url: "https://example.com/videos/better-real-estate-reel",
  },
  {
    title: "Use listing media after delivery",
    category: "Marketing",
    thumbnail: "https://picsum.photos/seed/nieri-video-media/800/450",
    url: "https://example.com/videos/use-listing-media",
  },
  {
    title: "What to expect on shoot day",
    category: "Client guide",
    thumbnail: "https://picsum.photos/seed/nieri-video-shoot-day/800/450",
    url: "https://example.com/videos/shoot-day",
  },
];

const toneOptions = ["Luxury", "Friendly", "Professional", "Modern", "Warm"];
const platformOptions = ["Instagram Reel", "TikTok", "Facebook", "YouTube Shorts"];

function formatDateTime(value) {
  if (!value) return "Not scheduled";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function StatusBadge({ status }) {
  const palette = {
    Scheduled: colors.warning,
    Editing: colors.gold,
    Delivered: colors.success,
    Completed: colors.success,
  };
  return (
    <View style={[styles.badge, { borderColor: palette[status] || colors.line }]}>
      <Text style={[styles.badgeText, { color: palette[status] || colors.muted }]}>{status}</Text>
    </View>
  );
}

function IconButton({ icon: Icon, label, onPress, variant = "primary", disabled = false }) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        isPrimary ? styles.iconButtonPrimary : styles.iconButtonSecondary,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Icon size={18} color={isPrimary ? colors.panel : colors.charcoal} strokeWidth={2.2} />
      <Text style={[styles.iconButtonText, isPrimary ? styles.iconButtonTextPrimary : null]}>
        {label}
      </Text>
    </Pressable>
  );
}

function TextField({ label, value, onChangeText, placeholder, multiline = false, keyboardType }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.warmGray}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[styles.input, multiline && styles.inputMultiline]}
      />
    </View>
  );
}

function OptionRow({ options, value, onChange }) {
  return (
    <View style={styles.optionRow}>
      {options.map((option) => {
        const item = typeof option === "string" ? { value: option, label: option } : option;
        const selected = value === item.value;
        return (
          <Pressable
            key={item.value}
            onPress={() => onChange(item.value)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function HomeScreen({ orders, listings, loading, setActiveTab, setAiTool }) {
  const recentDelivered = useMemo(
    () => listings.find((listing) => listing.mediaUrl) || orders.find((order) => order.deliverablesUrl),
    [listings, orders],
  );

  const quickActions = [
    { label: "Book a Shoot", icon: CalendarPlus, action: () => setActiveTab("book") },
    { label: "My Listings / Orders", icon: Images, action: () => setActiveTab("media") },
    {
      label: "AI Listing Description",
      icon: WandSparkles,
      action: () => {
        setAiTool("listing");
        setActiveTab("ai");
      },
    },
    {
      label: "Social Media Script",
      icon: Sparkles,
      action: () => {
        setAiTool("social");
        setActiveTab("ai");
      },
    },
    { label: "Prep Checklist", icon: ClipboardCheck, action: () => setActiveTab("book") },
  ];

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <View style={styles.hero}>
        <View style={styles.logoPlate}>
          <Image source={nieriLogo} style={styles.logoImage} resizeMode="contain" />
        </View>
        <Text style={styles.eyebrow}>Nieri Creative</Text>
        <Text style={styles.heroTitle}>Welcome back</Text>
        <Text style={styles.heroCopy}>
          Book media, check delivery status, prep the property, and create simple listing marketing
          from one clean place.
        </Text>
      </View>

      <View style={styles.quickGrid}>
        {quickActions.map((item) => (
          <Pressable key={item.label} onPress={item.action} style={styles.quickCard}>
            <item.icon size={22} color={colors.charcoal} strokeWidth={2.1} />
            <Text style={styles.quickLabel}>{item.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Latest Delivery</Text>
        {loading ? <ActivityIndicator color={colors.gold} /> : null}
      </View>

      {recentDelivered ? (
        <View style={styles.deliveryCard}>
          <ImageBackground
            source={{ uri: recentDelivered.heroImageUrl || "https://picsum.photos/seed/nieri-home/900/600" }}
            style={styles.deliveryImage}
            imageStyle={styles.deliveryImageRadius}
          >
            <View style={styles.deliveryOverlay}>
              <StatusBadge status={recentDelivered.status || "Delivered"} />
              <Text style={styles.deliveryTitle}>{recentDelivered.address}</Text>
              <Text style={styles.deliveryMeta}>Media ready for client review</Text>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Images size={26} color={colors.muted} />
          <Text style={styles.emptyTitle}>No delivered media yet</Text>
          <Text style={styles.emptyCopy}>Your most recent delivered property will appear here.</Text>
        </View>
      )}
    </ScrollView>
  );
}

function BookScreen({ checkedItems, setCheckedItems, openUrl, goHome }) {
  const completedCount = checklistItems.filter((item) => checkedItems[item]).length;

  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <View style={styles.section}>
        <Text style={styles.screenTitle}>Book a Shoot</Text>
        <Text style={styles.screenCopy}>
          Aryeo handles login, ordering, payment, scheduling, and customer tracking.
        </Text>
        <IconButton icon={ExternalLink} label="Open Aryeo Booking" onPress={() => openUrl(ARYEO_ORDER_FORM_URL)} />
        <IconButton icon={Home} label="Back Home" variant="secondary" onPress={goHome} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Prep Checklist</Text>
            <Text style={styles.sectionSubcopy}>{completedCount} of {checklistItems.length} complete</Text>
          </View>
          <Pressable onPress={() => setCheckedItems({})} style={styles.smallButton}>
            <Text style={styles.smallButtonText}>Reset</Text>
          </Pressable>
        </View>
        <View style={styles.checklist}>
          {checklistItems.map((item) => {
            const checked = Boolean(checkedItems[item]);
            const Icon = checked ? CheckCircle2 : Circle;
            return (
              <Pressable
                key={item}
                style={styles.checkRow}
                onPress={() => setCheckedItems((current) => ({ ...current, [item]: !checked }))}
              >
                <Icon size={22} color={checked ? colors.success : colors.muted} />
                <Text style={[styles.checkText, checked && styles.checkTextDone]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How-To Videos</Text>
        <View style={styles.videoGrid}>
          {howToVideos.map((video) => (
            <Pressable key={video.title} style={styles.videoCard} onPress={() => openUrl(video.url)}>
              <ImageBackground source={{ uri: video.thumbnail }} style={styles.videoImage} imageStyle={styles.videoImageRadius}>
                <View style={styles.playBadge}>
                  <PlayCircle size={22} color={colors.panel} />
                </View>
              </ImageBackground>
              <Text style={styles.videoCategory}>{video.category}</Text>
              <Text style={styles.videoTitle}>{video.title}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function MediaScreen({ orders, appointments, loading, error, refresh, copyLink, openUrl }) {
  return (
    <ScrollView contentContainerStyle={styles.screenContent}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.screenTitle}>Listings & Orders</Text>
          <Text style={styles.screenCopy}>Mock Aryeo media, appointments, and order status.</Text>
        </View>
        <Pressable onPress={refresh} style={styles.refreshButton}>
          {loading ? <Loader2 size={18} color={colors.muted} /> : <Text style={styles.refreshText}>Refresh</Text>}
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {orders.map((order) => {
        const appointment = appointments.find((item) => item.listingId === order.listingId);
        return (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderTop}>
              <View style={styles.orderAddressWrap}>
                <MapPin size={18} color={colors.gold} />
                <Text style={styles.orderAddress}>{order.address}</Text>
              </View>
              <StatusBadge status={order.status} />
            </View>
            <View style={styles.metaRow}>
              <Calendar size={17} color={colors.muted} />
              <Text style={styles.metaText}>
                {formatDateTime(order.appointmentStartsAt || appointment?.startsAt)}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <BadgeCheck size={17} color={colors.muted} />
              <Text style={styles.metaText}>{order.packageName}</Text>
            </View>
            <View style={styles.orderActions}>
              <IconButton
                icon={Link2}
                label="View Media"
                variant="secondary"
                disabled={!order.deliverablesUrl}
                onPress={() => openUrl(order.deliverablesUrl)}
              />
              <IconButton
                icon={Copy}
                label="Copy Link"
                variant="secondary"
                disabled={!order.deliverablesUrl}
                onPress={() => copyLink(order.deliverablesUrl)}
              />
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function AiToolsScreen({ aiTool, setAiTool }) {
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.flex}>
      <ScrollView contentContainerStyle={styles.screenContent}>
        <Text style={styles.screenTitle}>AI Tools</Text>
        <Text style={styles.screenCopy}>Generate quick marketing copy from backend-only AI endpoints.</Text>
        <OptionRow
          options={[
            { value: "listing", label: "Listing Description" },
            { value: "social", label: "Social Script" },
          ]}
          value={aiTool}
          onChange={setAiTool}
        />
        {aiTool === "listing" ? <ListingDescriptionTool /> : <SocialScriptTool />}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function ListingDescriptionTool() {
  const [form, setForm] = useState({
    address: "",
    bedrooms: "",
    bathrooms: "",
    squareFeet: "",
    keyFeatures: "",
    tone: "Professional",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    setLoading(true);
    try {
      setResult(await api.createListingDescription(form));
    } catch (error) {
      Alert.alert("Could not generate copy", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.toolStack}>
      <TextField label="Property address" value={form.address} onChangeText={(value) => update("address", value)} placeholder="214 Harbor View Lane" />
      <View style={styles.twoColumn}>
        <TextField label="Bedrooms" value={form.bedrooms} onChangeText={(value) => update("bedrooms", value)} placeholder="4" keyboardType="numeric" />
        <TextField label="Bathrooms" value={form.bathrooms} onChangeText={(value) => update("bathrooms", value)} placeholder="3.5" keyboardType="decimal-pad" />
      </View>
      <TextField label="Square footage" value={form.squareFeet} onChangeText={(value) => update("squareFeet", value)} placeholder="3120" keyboardType="numeric" />
      <TextField label="Key features" value={form.keyFeatures} onChangeText={(value) => update("keyFeatures", value)} placeholder="Water views, chef kitchen, screened porch" multiline />
      <Text style={styles.fieldLabel}>Tone</Text>
      <OptionRow options={toneOptions} value={form.tone} onChange={(value) => update("tone", value)} />
      <IconButton icon={WandSparkles} label={loading ? "Generating" : "Generate Listing Copy"} onPress={submit} disabled={loading} />

      {result ? (
        <View style={styles.results}>
          <ResultBlock title="MLS Description" text={result.mlsDescription} />
          <ResultBlock title="Short Portal Description" text={result.shortDescription} />
          <ResultBlock title="Social Caption" text={result.socialCaption} />
        </View>
      ) : null}
    </View>
  );
}

function SocialScriptTool() {
  const [form, setForm] = useState({
    propertyType: "",
    location: "",
    priceRange: "",
    keySellingPoints: "",
    platform: "Instagram Reel",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  async function submit() {
    setLoading(true);
    try {
      setResult(await api.createSocialScript(form));
    } catch (error) {
      Alert.alert("Could not generate script", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.toolStack}>
      <TextField label="Property type" value={form.propertyType} onChangeText={(value) => update("propertyType", value)} placeholder="Townhome" />
      <TextField label="Location / neighborhood" value={form.location} onChangeText={(value) => update("location", value)} placeholder="Old Town Alexandria" />
      <TextField label="Price range" value={form.priceRange} onChangeText={(value) => update("priceRange", value)} placeholder="$900K - $1.1M" />
      <TextField label="Key selling points" value={form.keySellingPoints} onChangeText={(value) => update("keySellingPoints", value)} placeholder="Historic block, renovated kitchen, private patio" multiline />
      <Text style={styles.fieldLabel}>Platform</Text>
      <OptionRow options={platformOptions} value={form.platform} onChange={(value) => update("platform", value)} />
      <IconButton icon={Sparkles} label={loading ? "Generating" : "Generate Social Script"} onPress={submit} disabled={loading} />

      {result ? (
        <View style={styles.results}>
          <ResultBlock title="Hook" text={result.hook} />
          <ResultBlock title="15-Second Script" text={result.fifteenSecondScript} />
          <ResultBlock title="30-Second Script" text={result.thirtySecondScript} />
          <ResultBlock title="CTA" text={result.cta} />
          <ResultBlock title="Caption" text={result.caption} />
        </View>
      ) : null}
    </View>
  );
}

function ResultBlock({ title, text }) {
  return (
    <View style={styles.resultBlock}>
      <Text style={styles.resultTitle}>{title}</Text>
      <Text style={styles.resultText}>{text}</Text>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [aiTool, setAiTool] = useState("listing");
  const [orders, setOrders] = useState([]);
  const [listings, setListings] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  async function refresh() {
    setLoading(true);
    setError("");
    try {
      const [nextListings, nextOrders, nextAppointments] = await Promise.all([
        api.getListings(),
        api.getOrders(),
        api.getAppointments(),
      ]);
      setListings(nextListings);
      setOrders(nextOrders);
      setAppointments(nextAppointments);
    } catch (requestError) {
      setError("Unable to reach the backend. Make sure it is running on the configured URL.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function copyLink(url) {
    if (!url) return;
    await Clipboard.setStringAsync(url);
    setToast("Media link copied");
    setTimeout(() => setToast(""), 1800);
  }

  async function openUrl(url) {
    if (!url) return;
    if (Platform.OS === "web") {
      const opened = globalThis.open?.(url, "_blank", "noopener,noreferrer");
      if (!opened) {
        Linking.openURL(url);
      }
      return;
    }
    await WebBrowser.openBrowserAsync(url, {
      presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
    });
  }

  const screen = {
    home: (
      <HomeScreen
        orders={orders}
        listings={listings}
        loading={loading}
        setActiveTab={setActiveTab}
        setAiTool={setAiTool}
      />
    ),
    book: (
      <BookScreen
        checkedItems={checkedItems}
        setCheckedItems={setCheckedItems}
        openUrl={openUrl}
        goHome={() => setActiveTab("home")}
      />
    ),
    media: (
      <MediaScreen
        orders={orders}
        appointments={appointments}
        loading={loading}
        error={error}
        refresh={refresh}
        copyLink={copyLink}
        openUrl={openUrl}
      />
    ),
    ai: <AiToolsScreen aiTool={aiTool} setAiTool={setAiTool} />,
  }[activeTab];

  return (
    <SafeAreaView style={styles.appShell}>
      <View style={styles.appBody}>{screen}</View>
      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[styles.tabItem, selected && styles.tabItemSelected]}
            >
              <Icon size={21} color={selected ? colors.gold : colors.muted} strokeWidth={2.2} />
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{tab.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  appBody: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  screenContent: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 116,
    gap: 20,
    width: "100%",
    maxWidth: 720,
    alignSelf: "center",
  },
  hero: {
    backgroundColor: colors.yellow,
    borderRadius: 8,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.charcoal,
  },
  logoPlate: {
    alignSelf: "flex-start",
    backgroundColor: colors.panel,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.charcoal,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  logoImage: {
    width: 210,
    height: 48,
  },
  eyebrow: {
    color: colors.charcoal,
    fontFamily: typography.heading,
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: colors.charcoal,
    fontFamily: typography.heading,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: "900",
    letterSpacing: 0,
  },
  heroCopy: {
    color: colors.charcoal,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickCard: {
    width: "47.8%",
    minHeight: 104,
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.charcoal,
    padding: 16,
    gap: 14,
    justifyContent: "space-between",
    ...shadows.card,
  },
  quickLabel: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "900",
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0,
  },
  sectionSubcopy: {
    color: colors.muted,
    fontFamily: typography.body,
    marginTop: 4,
    fontSize: 14,
  },
  screenTitle: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "900",
    letterSpacing: 0,
  },
  screenCopy: {
    color: colors.muted,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 560,
  },
  deliveryCard: {
    borderRadius: 8,
    backgroundColor: colors.panel,
    ...shadows.card,
  },
  deliveryImage: {
    height: 230,
    justifyContent: "flex-end",
  },
  deliveryImageRadius: {
    borderRadius: 8,
  },
  deliveryOverlay: {
    padding: 16,
    gap: 8,
    backgroundColor: "rgba(44,44,44,0.64)",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  deliveryTitle: {
    color: colors.panel,
    fontFamily: typography.heading,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "900",
  },
  deliveryMeta: {
    color: colors.yellowSoft,
    fontFamily: typography.body,
    fontSize: 14,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 24,
    backgroundColor: colors.panel,
  },
  emptyTitle: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 17,
    fontWeight: "800",
  },
  emptyCopy: {
    color: colors.muted,
    fontFamily: typography.body,
    textAlign: "center",
    lineHeight: 20,
  },
  iconButton: {
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconButtonPrimary: {
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.charcoal,
  },
  iconButtonSecondary: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.charcoal,
  },
  iconButtonText: {
    fontFamily: typography.heading,
    fontSize: 15,
    fontWeight: "900",
    color: colors.charcoal,
  },
  iconButtonTextPrimary: {
    color: colors.panel,
  },
  disabledButton: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  smallButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: colors.charcoal,
  },
  smallButtonText: {
    color: colors.charcoal,
    fontFamily: typography.heading,
    fontWeight: "900",
  },
  checklist: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    overflow: "hidden",
  },
  checkRow: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  checkText: {
    flex: 1,
    color: colors.ink,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
  },
  checkTextDone: {
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  videoGrid: {
    gap: 14,
  },
  videoCard: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: 10,
    gap: 8,
    ...shadows.card,
  },
  videoImage: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  videoImageRadius: {
    borderRadius: 6,
  },
  playBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(44,44,44,0.82)",
  },
  videoCategory: {
    color: colors.gold,
    fontFamily: typography.heading,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  videoTitle: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  orderCard: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: 16,
    gap: 12,
    ...shadows.card,
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  orderAddressWrap: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  orderAddress: {
    flex: 1,
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: "900",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    color: colors.muted,
    fontFamily: typography.body,
    fontSize: 14,
    lineHeight: 19,
  },
  orderActions: {
    flexDirection: "row",
    gap: 10,
  },
  badge: {
    alignSelf: "flex-start",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.panel,
  },
  badgeText: {
    fontFamily: typography.heading,
    fontSize: 12,
    fontWeight: "900",
  },
  refreshButton: {
    minHeight: 40,
    minWidth: 72,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: colors.yellowSoft,
    borderWidth: 1,
    borderColor: colors.charcoal,
  },
  refreshText: {
    color: colors.charcoal,
    fontFamily: typography.heading,
    fontWeight: "900",
  },
  errorText: {
    color: colors.danger,
    backgroundColor: colors.blush,
    borderRadius: 8,
    padding: 12,
    lineHeight: 20,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    color: colors.ink,
    fontFamily: typography.heading,
    fontSize: 14,
    fontWeight: "800",
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: colors.warmGray,
    backgroundColor: colors.panel,
    borderRadius: 8,
    paddingHorizontal: 13,
    paddingVertical: 12,
    color: colors.ink,
    fontFamily: typography.body,
    fontSize: 15,
  },
  inputMultiline: {
    minHeight: 104,
    textAlignVertical: "top",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  option: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    backgroundColor: colors.panel,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  optionSelected: {
    backgroundColor: colors.yellow,
    borderColor: colors.charcoal,
  },
  optionText: {
    color: colors.charcoal,
    fontFamily: typography.heading,
    fontWeight: "800",
    fontSize: 14,
  },
  optionTextSelected: {
    color: colors.charcoal,
  },
  twoColumn: {
    flexDirection: "row",
    gap: 12,
  },
  toolStack: {
    gap: 14,
  },
  results: {
    gap: 12,
  },
  resultBlock: {
    backgroundColor: colors.panel,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.warmGray,
    padding: 14,
    gap: 7,
  },
  resultTitle: {
    color: colors.gold,
    fontFamily: typography.heading,
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0,
  },
  resultText: {
    color: colors.ink,
    fontFamily: typography.body,
    fontSize: 15,
    lineHeight: 22,
  },
  tabBar: {
    position: "absolute",
    left: 14,
    right: 14,
    bottom: Platform.OS === "ios" ? 20 : 14,
    minHeight: 68,
    borderRadius: 8,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.charcoal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    ...shadows.card,
  },
  tabItem: {
    flex: 1,
    minHeight: 54,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderRadius: 8,
  },
  tabItemSelected: {
    backgroundColor: colors.yellow,
  },
  tabLabel: {
    color: colors.muted,
    fontFamily: typography.heading,
    fontSize: 12,
    fontWeight: "800",
  },
  tabLabelSelected: {
    color: colors.charcoal,
  },
  toast: {
    position: "absolute",
    alignSelf: "center",
    bottom: 102,
    backgroundColor: colors.charcoal,
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  toastText: {
    color: colors.panel,
    fontFamily: typography.heading,
    fontWeight: "800",
  },
});
