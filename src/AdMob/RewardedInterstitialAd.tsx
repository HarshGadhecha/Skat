import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
    AdEventType,
    RewardedAdEventType,
    RewardedInterstitialAd,
    TestIds
} from 'react-native-google-mobile-ads';

// Ad Unit IDs - Replace with your actual IDs from AdMob console
const AD_UNIT_ID = __DEV__
    ? TestIds.REWARDED_INTERSTITIAL  // Test ID for development
    : Platform.select({
        ios: 'ca-app-pub-2586473739778438/6606344014',      // Your iOS Ad Unit ID
        android: 'ca-app-pub-2586473739778438/2852723847',  // Your Android Ad Unit ID
    });

interface RewardedInterstitialAdHookResult {
    isLoaded: boolean;
    isLoading: boolean;
    isClosed: boolean;
    isRewarded: boolean;
    load: () => void;
    show: () => Promise<boolean>;
    reset: () => void;
}

export const useRewardedInterstitialAd = (): RewardedInterstitialAdHookResult => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isClosed, setIsClosed] = useState(false);
    const [isRewarded, setIsRewarded] = useState(false);
    const [adInstance, setAdInstance] = useState<RewardedInterstitialAd | null>(null);

    useEffect(() => {
        // Create ad instance on mount
        const ad = RewardedInterstitialAd.createForAdRequest(AD_UNIT_ID as string, {
            requestNonPersonalizedAdsOnly: false,
            keywords: ['game', 'entertainment', 'puzzle'],
        });

        // Set up event listeners
        const unsubscribeLoaded = ad.addAdEventListener(
            RewardedAdEventType.LOADED,
            () => {
                console.log('Rewarded Interstitial Ad Loaded');
                setIsLoaded(true);
                setIsLoading(false);
            }
        );

        const unsubscribeEarned = ad.addAdEventListener(
            RewardedAdEventType.EARNED_REWARD,
            (reward) => {
                console.log('User earned reward:', reward);
                setIsRewarded(true);
            }
        );

        const unsubscribeClosed = ad.addAdEventListener(
            AdEventType.CLOSED,
            () => {
                console.log('Rewarded Interstitial Ad Closed');
                setIsClosed(true);
                setIsLoaded(false);
            }
        );

        const unsubscribeError = ad.addAdEventListener(
            AdEventType.ERROR,
            (error) => {
                console.error('Rewarded Interstitial Ad Error:', error);
                setIsLoaded(false);
                setIsLoading(false);
            }
        );

        setAdInstance(ad);

        // Load the ad immediately
        ad.load();
        setIsLoading(true);

        // Cleanup
        return () => {
            unsubscribeLoaded();
            unsubscribeEarned();
            unsubscribeClosed();
            unsubscribeError();
        };
    }, []);

    const load = () => {
        if (adInstance && !isLoaded && !isLoading) {
            setIsLoading(true);
            setIsRewarded(false);
            setIsClosed(false);
            adInstance.load();
        }
    };

    const show = async (): Promise<boolean> => {
        if (isLoaded && adInstance) {
            try {
                await adInstance.show();
                return true;
            } catch (error) {
                console.error('Error showing ad:', error);
                return false;
            }
        }
        console.warn('Ad not loaded yet');
        return false;
    };

    const reset = () => {
        setIsRewarded(false);
        setIsClosed(false);
        load();
    };

    return {
        isLoaded,
        isLoading,
        isClosed,
        isRewarded,
        load,
        show,
        reset,
    };
};